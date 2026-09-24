import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Chip, Typography, Alert,
  CircularProgress, Tooltip, FormControl, InputLabel, Select,
  Drawer, Divider, Stack,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon    from '@mui/icons-material/AddOutlined';
import CloseIcon  from '@mui/icons-material/CloseOutlined';
import { loadSQLDatasets, loadSQLQuestionSet } from '../../api/databaseApi.js';
import {
  adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion,
  adminGetTestCaseByQuestion,
  adminCreateTestCase, adminUpdateTestCase, adminDeleteTestCase,
  adminGetSolutionsByQuestion,
  adminCreateSolution, adminUpdateSolution, adminDeleteSolution,
} from '../../api/adminApi.js';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const toArray = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const toStr   = (a) => (Array.isArray(a) ? a.join(', ') : a ?? '');
const DIFF_COLOR = { EASY: 'success', MEDIUM: 'warning', HARD: 'error' };

// ── Question form defaults ────────────────────────────────────────────────────
const EMPTY_Q = { datasetId: '', title: '', question: '', difficulty: 'MEDIUM', type: '', tags: '', tableNames: '' };

// ── TC form defaults ──────────────────────────────────────────────────────────
const EMPTY_TC = { questionId: '', type: '', expectedSql: '', testCases: '[]' };

// ── Solution form defaults ────────────────────────────────────────────────────
const EMPTY_SOL = { questionId: '', datasetId: '', sqlMode: '', solutions: '[]' };

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
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function QuestionManager() {
  // ── Dataset + question list ───────────────────────────────────────────────
  const [datasets,  setDatasets]  = useState([]);
  const [datasetId, setDatasetId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [qLoading,  setQLoading]  = useState(false);
  const [listError, setListError] = useState(null);

  // ── Right drawer ──────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected,   setSelected]   = useState(null); // the question object

  // ── TC state (inside drawer) ──────────────────────────────────────────────
  const [tc,        setTc]        = useState(null);   // TestCases group or null
  const [tcLoading, setTcLoading] = useState(false);

  // ── Solutions state (inside drawer) ──────────────────────────────────────
  const [solutions,  setSolutions]  = useState([]);
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

  // ── Solution form dialog ──────────────────────────────────────────────────
  const [solFormOpen, setSolFormOpen] = useState(false);
  const [solEditId,   setSolEditId]   = useState(null);
  const [solForm,     setSolForm]     = useState(EMPTY_SOL);
  const [solFormBusy, setSolFormBusy] = useState(false);
  const [solFormErr,  setSolFormErr]  = useState(null);

  // ── Solution delete ───────────────────────────────────────────────────────
  const [solDeleteId,   setSolDeleteId]   = useState(null);
  const [solDeleteBusy, setSolDeleteBusy] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // Loaders
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadSQLDatasets({ page: 0, size: 200 }).then((res) => {
      if (res.isSuccess()) setDatasets(res.getData()?.items ?? []);
    });
  }, []);

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
    // Solutions
    setSolLoading(true);
    setSolutions([]);
    adminGetSolutionsByQuestion(questionId).then((res) => {
      setSolLoading(false);
      if (res.isSuccess()) setSolutions(res.getData() ?? []);
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
    setSolutions([]);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Question CRUD
  // ─────────────────────────────────────────────────────────────────────────
  const openQCreate = () => {
    setQEditingId(null);
    setQForm({ ...EMPTY_Q, datasetId });
    setQFormErr(null);
    setQFormOpen(true);
  };

  const openQEdit = (q) => {
    setQEditingId(q.id);
    setQForm({
      datasetId: q.datasetId ?? datasetId,
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
      loadQuestions(datasetId);
      if (qEditingId && selected?.id === qEditingId) setSelected(res.getData());
    } else setQFormErr(res.message);
  };

  const handleQDelete = async () => {
    setQDeleteBusy(true);
    const res = await adminDeleteQuestion(qDeleteId);
    setQDeleteBusy(false);
    setQDeleteId(null);
    if (res.isSuccess()) { loadQuestions(datasetId); closeDrawer(); }
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
  // Solution CRUD
  // ─────────────────────────────────────────────────────────────────────────
  const openSolCreate = () => {
    setSolEditId(null);
    setSolForm({ ...EMPTY_SOL, questionId: selected?.id ?? '', datasetId: selected?.datasetId ?? '' });
    setSolFormErr(null);
    setSolFormOpen(true);
  };

  const openSolEdit = (sol) => {
    setSolEditId(sol.id);
    setSolForm({
      questionId: sol.questionId ?? selected?.id ?? '',
      datasetId: sol.datasetId ?? '',
      sqlMode: sol.sqlMode ?? '',
      solutions: JSON.stringify(sol.solutions ?? [], null, 2),
    });
    setSolFormErr(null);
    setSolFormOpen(true);
  };

  const handleSolSave = async () => {
    let parsed;
    try { parsed = JSON.parse(solForm.solutions); } catch { setSolFormErr('Invalid JSON in solutions'); return; }
    setSolFormBusy(true);
    setSolFormErr(null);
    const payload = { ...solForm, solutions: parsed };
    const res = solEditId
      ? await adminUpdateSolution(solEditId, payload)
      : await adminCreateSolution(payload);
    setSolFormBusy(false);
    if (res.isSuccess()) {
      setSolFormOpen(false);
      adminGetSolutionsByQuestion(selected.id).then((r) => { if (r.isSuccess()) setSolutions(r.getData() ?? []); });
    } else setSolFormErr(res.message);
  };

  const handleSolDelete = async () => {
    setSolDeleteBusy(true);
    const res = await adminDeleteSolution(solDeleteId);
    setSolDeleteBusy(false);
    setSolDeleteId(null);
    if (res.isSuccess()) adminGetSolutionsByQuestion(selected.id).then((r) => { if (r.isSuccess()) setSolutions(r.getData() ?? []); });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* ── Dataset selector + New button ── */}
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

      {listError && <Alert severity="error" sx={{ mb: 2 }}>{listError}</Alert>}

      {qLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
      ) : datasetId ? (
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
                <Typography variant="subtitle2" fontWeight="600">Test Cases</Typography>
                {!tc && !tcLoading && (
                  <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openTcCreate}>
                    Create
                  </Button>
                )}
              </Box>

              {tcLoading ? (
                <CircularProgress size={20} />
              ) : tc ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {tc.type && <Chip label={tc.type} size="small" />}
                      <Chip label={`${tc.testCases?.length ?? 0} cases`} size="small" variant="outlined" />
                    </Stack>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit test cases"><IconButton size="small" onClick={openTcEdit}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setTcDeleteOpen(true)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </Box>
                  {tc.expectedSql && (
                    <Box component="pre" sx={{ mt: 1.5, p: 1, bgcolor: 'action.hover', borderRadius: 1, fontSize: 11, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                      {tc.expectedSql}
                    </Box>
                  )}
                </Paper>
              ) : (
                <Typography variant="body2" color="text.secondary">No test case group found.</Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* ── Expected Solutions section ── */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="600">Expected Solutions</Typography>
                <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openSolCreate}>
                  Add Solution
                </Button>
              </Box>

              {solLoading ? (
                <CircularProgress size={20} />
              ) : solutions.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><b>ID</b></TableCell>
                        <TableCell><b>SQL Mode</b></TableCell>
                        <TableCell><b>Entries</b></TableCell>
                        <TableCell align="right"><b>Actions</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {solutions.map((s) => (
                        <TableRow key={s.id} hover>
                          <TableCell><Typography variant="caption" color="text.secondary">{s.id}</Typography></TableCell>
                          <TableCell><Chip label={s.sqlMode || '—'} size="small" /></TableCell>
                          <TableCell><Typography variant="caption">{s.solutions?.length ?? 0}</Typography></TableCell>
                          <TableCell align="right">
                            <Tooltip title="Edit"><IconButton size="small" onClick={() => openSolEdit(s)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setSolDeleteId(s.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">No expected solutions found.</Typography>
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

      {/* ═══ Solution Form Dialog ════════════════════════════════════════════ */}
      <Dialog open={solFormOpen} onClose={() => setSolFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{solEditId ? 'Edit Expected Solution' : 'New Expected Solution'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {solFormErr && <Alert severity="error">{solFormErr}</Alert>}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Question ID" value={solForm.questionId} onChange={(e) => setSolForm({ ...solForm, questionId: e.target.value })} size="small" required fullWidth />
            <TextField label="Dataset ID" value={solForm.datasetId} onChange={(e) => setSolForm({ ...solForm, datasetId: e.target.value })} size="small" required fullWidth />
          </Box>
          <TextField label="SQL Mode" value={solForm.sqlMode} onChange={(e) => setSolForm({ ...solForm, sqlMode: e.target.value })} size="small" sx={{ width: 220 }} placeholder="e.g. STANDARD" />
          <JsonField
            label="Solutions (JSON array)"
            value={solForm.solutions}
            onChange={(v) => setSolForm((f) => ({ ...f, solutions: v }))}
            rows={10}
            helperText="Array of { solutionQuery, resultHash, expectedOutput: { columns, rows, rowsCount } }"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSolFormOpen(false)} disabled={solFormBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSolSave} disabled={solFormBusy || !solForm.questionId || !solForm.datasetId}>
            {solFormBusy ? <CircularProgress size={18} /> : solEditId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══ Solution Delete Confirm ══════════════════════════════════════════ */}
      <Dialog open={!!solDeleteId} onClose={() => setSolDeleteId(null)}>
        <DialogTitle>Delete solution?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This is a permanent hard delete.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSolDeleteId(null)} disabled={solDeleteBusy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleSolDelete} disabled={solDeleteBusy}>
            {solDeleteBusy ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
