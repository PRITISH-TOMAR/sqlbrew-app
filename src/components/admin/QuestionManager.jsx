import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Chip, Typography, Alert,
  CircularProgress, Tooltip, FormControl, InputLabel, Select,
  Drawer, Divider, Stack, Collapse,
} from '@mui/material';
import EditIcon       from '@mui/icons-material/EditOutlined';
import DeleteIcon     from '@mui/icons-material/DeleteOutlined';
import AddIcon        from '@mui/icons-material/AddOutlined';
import CloseIcon      from '@mui/icons-material/CloseOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { loadSQLDatasets, loadSQLQuestionSet } from '../../api/databaseApi.js';
import {
  adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion,
  adminGetTestCaseByQuestion,
  adminCreateTestCase, adminUpdateTestCase, adminDeleteTestCase,
  adminGetSolutionsByQuestion,
  adminGenerateSolution,
} from '../../api/adminApi.js';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const toArray = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const toStr   = (a) => (Array.isArray(a) ? a.join(', ') : a ?? '');
const DIFF_COLOR = { EASY: 'success', MEDIUM: 'warning', HARD: 'error' };

// ── Question form defaults ────────────────────────────────────────────────────
const EMPTY_Q = { datasetId: '', title: '', question: '', difficulty: 'MEDIUM', type: '', tags: '', tableNames: '' };

// ── TC form defaults ──────────────────────────────────────────────────────────
const EMPTY_TC = { questionId: '', type: '', expectedSql: '', testCases: '[]' };


// ─────────────────────────────────────────────────────────────────────────────
// Small helper: JSON textarea with validation
// ─────────────────────────────────────────────────────────────────────────────
function JsonField({ label, value, onChange, rows = 8, helperText }) {
  const [err, setErr] = useState(false);
  const handle = (v) => {
    onChange(v);
    try { JSON.parse(v); setErr(false); } catch { setErr(true); }
  };
  return (
    <TextField
      label={label} value={value} onChange={(e) => handle(e.target.value)}
      size="small" multiline rows={rows} fullWidth
      error={err} helperText={err ? 'Invalid JSON' : helperText}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TcCard — expandable card for a single TestCase entry
// ─────────────────────────────────────────────────────────────────────────────
function MiniTable({ columns, rows }) {
  if (!columns?.length) return null;
  return (
    <TableContainer sx={{ maxHeight: 200, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col} sx={{ fontWeight: 700, fontSize: 10, whiteSpace: 'nowrap', bgcolor: 'background.paper', py: 0.5 }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography variant="caption" color="text.secondary">0 rows</Typography>
              </TableCell>
            </TableRow>
          ) : rows?.map((row, ri) => (
            <TableRow key={ri}>
              {row.map((cell, ci) => (
                <TableCell key={ci} sx={{ fontSize: 10, whiteSpace: 'nowrap', py: 0.5 }}>
                  {cell === null || cell === undefined
                    ? <span style={{ opacity: 0.4, fontStyle: 'italic' }}>NULL</span>
                    : String(cell)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TcCard({ index, tcase }) {
  const [open, setOpen] = useState(false);
  const sampleTables = Array.isArray(tcase.sampleData) ? tcase.sampleData : [];
  const expOut = tcase.expectedOutput;
  const expCols = expOut?.columns ?? [];
  const expRows = expOut?.rows    ?? [];

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {/* Header row */}
      <Box
        onClick={() => setOpen((v) => !v)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, fontWeight: 600 }}>
          #{index + 1}
        </Typography>
        <Chip
          label={tcase.type ?? 'UNKNOWN'}
          size="small"
          color={tcase.type?.toLowerCase() === 'public' ? 'success' : 'default'}
          sx={{ fontSize: 10, height: 20 }}
        />
        {sampleTables.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            {sampleTables.map((t) => `${t.table}(${t.rows?.length ?? 0})`).join(', ')}
          </Typography>
        )}
        {expCols.length > 0 && (
          <Chip label={`out: ${expOut?.rowsCount ?? expRows.length}r`} size="small" variant="outlined" sx={{ fontSize: 10, height: 20, ml: 'auto' }} />
        )}
        <IconButton size="small" sx={{ ml: expCols.length > 0 ? 0 : 'auto', p: 0.25 }}>
          {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Expandable body */}
      <Collapse in={open}>
        <Box sx={{ px: 1.5, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {sampleTables.map((tbl) => (
            <Box key={tbl.table}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Sample — <strong>{tbl.table}</strong>
              </Typography>
              <MiniTable columns={tbl.columns} rows={tbl.rows} />
            </Box>
          ))}

          {expCols.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Expected Output
              </Typography>
              <MiniTable columns={expCols} rows={expRows} />
            </Box>
          )}

          {tcase.numericTolerance != null && (
            <Typography variant="caption" color="text.secondary">
              Numeric tolerance: {tcase.numericTolerance}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function QuestionManager({ datasetId: externalDatasetId = '' }) {
  // ── Dataset + question list ───────────────────────────────────────────────
  const [datasets,  setDatasets]  = useState([]);
  const [datasetId, setDatasetId] = useState('');
  const [questions, setQuestions] = useState([]);

  // When parent controls the dataset, mirror it
  const effectiveDatasetId = externalDatasetId || datasetId;
  const [qLoading,  setQLoading]  = useState(false);
  const [listError, setListError] = useState(null);

  // ── Right drawer ──────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected,   setSelected]   = useState(null); // the question object

  // ── TC state (inside drawer) ──────────────────────────────────────────────
  const [tc,        setTc]        = useState(null);   // TestCases group or null
  const [tcLoading, setTcLoading] = useState(false);

  // ── Solution state (single, inside drawer) ────────────────────────────────
  const [solution,   setSolution]   = useState(null);  // single ExpectedSolution or null
  const [solLoading, setSolLoading] = useState(false);

  // ── Question form dialog ──────────────────────────────────────────────────
  const [qFormOpen,  setQFormOpen]  = useState(false);
  const [qEditingId, setQEditingId] = useState(null);
  const [qForm,      setQForm]      = useState(EMPTY_Q);
  const [qFormBusy,  setQFormBusy]  = useState(false);
  const [qFormErr,   setQFormErr]   = useState(null);

  // ── Question delete ───────────────────────────────────────────────────────
  const [qDeleteId,   setQDeleteId]   = useState(null);
  const [qDeleteBusy, setQDeleteBusy] = useState(false);

  // ── TC form dialog ────────────────────────────────────────────────────────
  const [tcFormOpen, setTcFormOpen] = useState(false);
  const [tcEditId,   setTcEditId]   = useState(null);
  const [tcForm,     setTcForm]     = useState(EMPTY_TC);
  const [tcFormBusy, setTcFormBusy] = useState(false);
  const [tcFormErr,  setTcFormErr]  = useState(null);

  // ── TC delete ─────────────────────────────────────────────────────────────
  const [tcDeleteOpen, setTcDeleteOpen] = useState(false);
  const [tcDeleteBusy, setTcDeleteBusy] = useState(false);

  // ── Solution form dialog (SQL-entry only) ────────────────────────────────
  const [solFormOpen, setSolFormOpen] = useState(false);
  const [solQuery,    setSolQuery]    = useState('');
  const [solMode,     setSolMode]     = useState('');
  const [solFormBusy, setSolFormBusy] = useState(false);
  const [solFormErr,  setSolFormErr]  = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Loaders
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadSQLDatasets({ page: 0, size: 200 }).then((res) => {
      if (res.isSuccess()) setDatasets(res.getData()?.items ?? []);
    });
  }, []);

  // Reload questions whenever the external dataset changes
  useEffect(() => {
    if (externalDatasetId) {
      setQuestions([]);
      loadQuestions(externalDatasetId);
    } else {
      setQuestions([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalDatasetId]);

  const loadQuestions = (dsId) => {
    if (!dsId) return;
    setQLoading(true);
    setListError(null);
    loadSQLQuestionSet(dsId).then((res) => {
      setQLoading(false);
      if (res.isSuccess()) setQuestions(res.getData() ?? []);
      else setListError(res.message);
    });
  };

  const loadDrawerData = (questionId) => {
    // TC
    setTcLoading(true);
    setTc(null);
    adminGetTestCaseByQuestion(questionId).then((res) => {
      setTcLoading(false);
      if (res.isSuccess()) setTc(res.getData());
    });
    // Solution (single)
    setSolLoading(true);
    setSolution(null);
    adminGetSolutionsByQuestion(questionId).then((res) => {
      setSolLoading(false);
      if (res.isSuccess()) {
        const list = res.getData() ?? [];
        setSolution(list.length > 0 ? list[0] : null);
      }
    });
  };

  const openDrawer = (q) => {
    setSelected(q);
    setDrawerOpen(true);
    loadDrawerData(q.id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelected(null);
    setTc(null);
    setSolution(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Question CRUD
  // ─────────────────────────────────────────────────────────────────────────
  const openQCreate = () => {
    setQEditingId(null);
    setQForm({ ...EMPTY_Q, datasetId: effectiveDatasetId });
    setQFormErr(null);
    setQFormOpen(true);
  };

  const openQEdit = (q) => {
    setQEditingId(q.id);
    setQForm({
      datasetId: q.datasetId ?? effectiveDatasetId,
      title: q.title ?? '', question: q.question ?? '',
      difficulty: q.difficulty ?? 'MEDIUM', type: q.type ?? '',
      tags: toStr(q.tags), tableNames: toStr(q.tableNames),
    });
    setQFormErr(null);
    setQFormOpen(true);
  };

  const handleQSave = async () => {
    setQFormBusy(true);
    setQFormErr(null);
    const payload = { ...qForm, tags: toArray(qForm.tags), tableNames: toArray(qForm.tableNames) };
    const res = qEditingId
      ? await adminUpdateQuestion(qEditingId, payload)
      : await adminCreateQuestion(payload);
    setQFormBusy(false);
    if (res.isSuccess()) {
      setQFormOpen(false);
      loadQuestions(effectiveDatasetId);
      if (qEditingId && selected?.id === qEditingId) setSelected(res.getData());
    } else setQFormErr(res.message);
  };

  const handleQDelete = async () => {
    setQDeleteBusy(true);
    const res = await adminDeleteQuestion(qDeleteId);
    setQDeleteBusy(false);
    setQDeleteId(null);
    if (res.isSuccess()) { loadQuestions(effectiveDatasetId); closeDrawer(); }
    else setListError(res.message);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TC CRUD
  // ─────────────────────────────────────────────────────────────────────────
  const openTcCreate = () => {
    setTcEditId(null);
    setTcForm({ ...EMPTY_TC, questionId: selected?.id ?? '' });
    setTcFormErr(null);
    setTcFormOpen(true);
  };

  const openTcEdit = () => {
    if (!tc) return;
    setTcEditId(tc.id);
    setTcForm({
      questionId: tc.questionId ?? selected?.id ?? '',
      type: tc.type ?? '',
      expectedSql: tc.expectedSql ?? '',
      testCases: JSON.stringify(tc.testCases ?? [], null, 2),
    });
    setTcFormErr(null);
    setTcFormOpen(true);
  };

  const handleTcSave = async () => {
    let parsed;
    try { parsed = JSON.parse(tcForm.testCases); } catch { setTcFormErr('Invalid JSON in test cases'); return; }
    setTcFormBusy(true);
    setTcFormErr(null);
    const payload = { ...tcForm, testCases: parsed };
    const res = tcEditId
      ? await adminUpdateTestCase(tcEditId, payload)
      : await adminCreateTestCase(payload);
    setTcFormBusy(false);
    if (res.isSuccess()) { setTcFormOpen(false); setTc(res.getData()); }
    else setTcFormErr(res.message);
  };

  const handleTcDelete = async () => {
    if (!tc) return;
    setTcDeleteBusy(true);
    const res = await adminDeleteTestCase(tc.id);
    setTcDeleteBusy(false);
    setTcDeleteOpen(false);
    if (res.isSuccess()) setTc(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Solution — generate via backend execution
  // ─────────────────────────────────────────────────────────────────────────
  const openSolForm = () => {
    const existing = solution?.solutions?.[0];
    setSolQuery(existing?.solutionQuery ?? '');
    setSolMode(solution?.sqlMode ?? '');
    setSolFormErr(null);
    setSolFormOpen(true);
  };

  const handleSolGenerate = async () => {
    if (!solQuery.trim()) { setSolFormErr('SQL query is required'); return; }
    setSolFormBusy(true);
    setSolFormErr(null);
    const res = await adminGenerateSolution(selected.id, { solutionQuery: solQuery, sqlMode: solMode });
    setSolFormBusy(false);
    if (res.isSuccess()) {
      setSolFormOpen(false);
      setSolution(res.getData());
    } else setSolFormErr(res.message);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ── Dataset selector + New button (only when no external datasetId) ── */}
      {!externalDatasetId && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 280 }}>
            <InputLabel>Select Dataset</InputLabel>
            <Select
              label="Select Dataset" value={datasetId}
              onChange={(e) => { setDatasetId(e.target.value); setQuestions([]); loadQuestions(e.target.value); }}
            >
              {datasets.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.title}
                  <Typography variant="caption" color="text.secondary" ml={1}>({d.id})</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openQCreate} disabled={!datasetId}>
            New Question
          </Button>
        </Box>
      )}

      {/* ── New Question button when external dataset is active ── */}
      {externalDatasetId && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {qLoading ? 'Loading…' : `${questions.length} question(s)`}
          </Typography>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openQCreate}>
            New Question
          </Button>
        </Box>
      )}

      {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}

      {qLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
      ) : effectiveDatasetId ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Difficulty</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" py={3}>No questions</Typography>
                </TableCell></TableRow>
              ) : questions.map((q) => (
                <TableRow
                  key={q.id} hover
                  onClick={() => openDrawer(q)}
                  sx={{ cursor: 'pointer', bgcolor: selected?.id === q.id ? 'action.selected' : 'inherit' }}
                >
                  <TableCell><Typography variant="caption" color="text.secondary">{q.id}</Typography></TableCell>
                  <TableCell>{q.title}</TableCell>
                  <TableCell><Chip label={q.difficulty} size="small" color={DIFF_COLOR[q.difficulty] ?? 'default'} /></TableCell>
                  <TableCell><Typography variant="caption">{q.type}</Typography></TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit question"><IconButton size="small" onClick={() => openQEdit(q)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Soft delete"><IconButton size="small" color="error" onClick={() => setQDeleteId(q.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" py={2}>Select a dataset to view its questions.</Typography>
      )}


      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT DRAWER — question detail + TC + solutions
      ═════════════════════════════════════════════════════════════════════ */}
      <Drawer
        anchor="right" open={drawerOpen} onClose={closeDrawer}
        PaperProps={{ sx: { width: 620, p: 3, overflowY: 'auto' } }}
      >
        {selected && (
          <>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>{selected.title}</Typography>
                <Typography variant="caption" color="text.secondary">ID: {selected.id}</Typography>
              </Box>
              <IconButton size="small" onClick={closeDrawer}><CloseIcon /></IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={selected.difficulty} size="small" color={DIFF_COLOR[selected.difficulty] ?? 'default'} />
              {selected.type && <Chip label={selected.type} size="small" variant="outlined" />}
            </Box>

            {selected.question && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                {selected.question}
              </Typography>
            )}

            <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openQEdit(selected)} sx={{ mb: 2 }}>
              Edit Question
            </Button>

            <Divider sx={{ my: 2 }} />

            {/* ── Test Cases section ── */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600">Test Cases</Typography>
                  {tc && <Chip label={`${tc.testCases?.length ?? 0}`} size="small" variant="outlined" sx={{ height: 18, fontSize: 10 }} />}
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {tc ? (
                    <>
                      <Tooltip title="Edit"><IconButton size="small" onClick={openTcEdit}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete group"><IconButton size="small" color="error" onClick={() => setTcDeleteOpen(true)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </>
                  ) : !tcLoading && (
                    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openTcCreate}>
                      Create
                    </Button>
                  )}
                </Box>
              </Box>

              {tcLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}><CircularProgress size={20} /></Box>
              ) : tc ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* Expected SQL */}
                  {tc.expectedSql && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Expected SQL
                      </Typography>
                      <Box component="pre" sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1, fontSize: 11, whiteSpace: 'pre-wrap', overflowX: 'auto', m: 0 }}>
                        {tc.expectedSql}
                      </Box>
                    </Box>
                  )}

                  {/* Individual test case cards */}
                  {tc.testCases?.length > 0 ? (
                    tc.testCases.map((tcase, i) => (
                      <TcCard key={tcase.id ?? i} index={i} tcase={tcase} />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No individual test cases in this group.</Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">No test case group found.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ── Expected Solution section (single) ── */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="600">Expected Solution</Typography>
                <Button size="small" variant="contained" startIcon={solution ? <EditIcon /> : <AddIcon />} onClick={openSolForm}>
                  {solution ? 'Edit Solution' : 'Set Solution'}
                </Button>
              </Box>

              {solLoading ? (
                <CircularProgress size={20} />
              ) : solution ? (() => {
                const entry  = solution.solutions?.[0];
                const output = entry?.expectedOutput;
                const cols   = output?.columns ?? [];
                const rows   = output?.rows    ?? [];
                return (
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    {/* Meta chips */}
                    <Stack direction="row" gap={1} flexWrap="wrap" mb={1.5}>
                      {solution.sqlMode && <Chip label={solution.sqlMode} size="small" />}
                      {output && (
                        <Chip
                          label={`${output.rowsCount ?? rows.length} rows · ${cols.length} cols`}
                          size="small" variant="outlined"
                        />
                      )}
                    </Stack>

                    {/* SQL query */}
                    {entry?.solutionQuery && (
                      <Box component="pre" sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1, fontSize: 11, whiteSpace: 'pre-wrap', overflowX: 'auto', mb: 1.5, mt: 0 }}>
                        {entry.solutionQuery}
                      </Box>
                    )}

                    {/* Expected output table */}
                    {cols.length > 0 && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          Expected Output
                        </Typography>
                        <TableContainer sx={{ maxHeight: 260, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 1 }}>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                {cols.map((col) => (
                                  <TableCell key={col} sx={{ fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap', bgcolor: 'background.paper' }}>
                                    {col}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={cols.length} align="center">
                                    <Typography variant="caption" color="text.secondary">0 rows</Typography>
                                  </TableCell>
                                </TableRow>
                              ) : rows.map((row, ri) => (
                                <TableRow key={ri}>
                                  {row.map((cell, ci) => (
                                    <TableCell key={ci} sx={{ fontSize: 11, whiteSpace: 'nowrap' }}>
                                      {cell === null || cell === undefined
                                        ? <span style={{ opacity: 0.4, fontStyle: 'italic' }}>NULL</span>
                                        : String(cell)}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </Paper>
                );
              })() : (
                <Typography variant="body2" color="text.secondary">No expected solution yet. Enter a SQL query to generate one.</Typography>
              )}
            </Box>
          </>
        )}
      </Drawer>

      {/* ═══ Question Form Dialog ═══════════════════════════════════════════ */}
      <Dialog open={qFormOpen} onClose={() => setQFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{qEditingId ? 'Edit Question' : 'New Question'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {qFormErr && <Alert severity="error">{qFormErr}</Alert>}
          <TextField label="Dataset ID" value={qForm.datasetId} onChange={(e) => setQForm({ ...qForm, datasetId: e.target.value })} size="small" required fullWidth />
          <TextField label="Title" value={qForm.title} onChange={(e) => setQForm({ ...qForm, title: e.target.value })} size="small" required fullWidth />
          <TextField label="Problem statement" value={qForm.question} onChange={(e) => setQForm({ ...qForm, question: e.target.value })} size="small" multiline rows={4} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select label="Difficulty" value={qForm.difficulty} onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })} size="small" fullWidth>
              {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <TextField label="Type" value={qForm.type} onChange={(e) => setQForm({ ...qForm, type: e.target.value })} size="small" fullWidth placeholder="e.g. SELECT" />
          </Box>
          <TextField label="Tags (comma-separated)" value={qForm.tags} onChange={(e) => setQForm({ ...qForm, tags: e.target.value })} size="small" fullWidth />
          <TextField label="Table Names (comma-separated)" value={qForm.tableNames} onChange={(e) => setQForm({ ...qForm, tableNames: e.target.value })} size="small" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQFormOpen(false)} disabled={qFormBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleQSave} disabled={qFormBusy || !qForm.datasetId || !qForm.title}>
            {qFormBusy ? <CircularProgress size={18} /> : qEditingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ Question Delete Confirm ═════════════════════════════════════════ */}
      <Dialog open={!!qDeleteId} onClose={() => setQDeleteId(null)}>
        <DialogTitle>Soft-delete question?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Sets <code>deleted_at</code> and decrements the dataset question count.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQDeleteId(null)} disabled={qDeleteBusy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleQDelete} disabled={qDeleteBusy}>
            {qDeleteBusy ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ TC Form Dialog ══════════════════════════════════════════════════ */}
      <Dialog open={tcFormOpen} onClose={() => setTcFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{tcEditId ? 'Edit Test Case Group' : 'Create Test Case Group'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {tcFormErr && <Alert severity="error">{tcFormErr}</Alert>}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Question ID" value={tcForm.questionId} onChange={(e) => setTcForm({ ...tcForm, questionId: e.target.value })} size="small" required fullWidth />
            <TextField label="Type" value={tcForm.type} onChange={(e) => setTcForm({ ...tcForm, type: e.target.value })} size="small" fullWidth placeholder="e.g. SQL" />
          </Box>
          <TextField label="Expected SQL" value={tcForm.expectedSql} onChange={(e) => setTcForm({ ...tcForm, expectedSql: e.target.value })} size="small" multiline rows={3} fullWidth />
          <JsonField
            label="Test Cases (JSON array)"
            value={tcForm.testCases}
            onChange={(v) => setTcForm((f) => ({ ...f, testCases: v }))}
            rows={8}
            helperText="Array of { id, type, numericTolerance, sampleData, expectedOutput }"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTcFormOpen(false)} disabled={tcFormBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleTcSave} disabled={tcFormBusy || !tcForm.questionId}>
            {tcFormBusy ? <CircularProgress size={18} /> : tcEditId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ TC Delete Confirm ═══════════════════════════════════════════════ */}
      <Dialog open={tcDeleteOpen} onClose={() => setTcDeleteOpen(false)}>
        <DialogTitle>Delete test case group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Permanent hard delete — all test cases in this group will be removed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTcDeleteOpen(false)} disabled={tcDeleteBusy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleTcDelete} disabled={tcDeleteBusy}>
            {tcDeleteBusy ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ Solution Form Dialog (SQL-entry, execute & save) ═══════════════ */}
      <Dialog open={solFormOpen} onClose={() => setSolFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{solution ? 'Edit Expected Solution' : 'Set Expected Solution'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {solFormErr && <Alert severity="error">{solFormErr}</Alert>}
          <TextField
            label="SQL Mode"
            value={solMode}
            onChange={(e) => setSolMode(e.target.value)}
            size="small"
            sx={{ width: 220 }}
            placeholder="e.g. STANDARD"
          />
          <TextField
            label="Solution SQL query"
            value={solQuery}
            onChange={(e) => setSolQuery(e.target.value)}
            size="small"
            multiline
            rows={10}
            fullWidth
            required
            placeholder="SELECT ..."
            helperText="The backend will execute this query and store the result as the expected output."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSolFormOpen(false)} disabled={solFormBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSolGenerate} disabled={solFormBusy || !solQuery.trim()}>
            {solFormBusy ? <CircularProgress size={18} /> : 'Execute & Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
