import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Box, Typography, Chip, Divider, Stack, Button, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, IconButton, Tooltip, Skeleton, useTheme, LinearProgress,
} from '@mui/material';
import RunIcon from '@mui/icons-material/PlayArrowRounded';
import SubmitIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import PrevIcon from '@mui/icons-material/NavigateBeforeRounded';
import NextIcon from '@mui/icons-material/NavigateNextRounded';
import PassIcon from '@mui/icons-material/CheckCircle';
import FailIcon from '@mui/icons-material/Cancel';
import TerminalIcon from '@mui/icons-material/TerminalRounded';
import HGripIcon from '@mui/icons-material/DragIndicatorRounded';
import FileIcon from '@mui/icons-material/DataObjectRounded';
import SchemaIcon from '@mui/icons-material/TableChartRounded';
import ProblemIcon from '@mui/icons-material/SubjectRounded';
import { loadProblemDetails, runSQLQuery, submitSQLQuery, getJobResult } from '../../api/databaseApi';
import { SQLTestComparison } from '../../components/judge';

const DIFFICULTY_COLOR = { easy: 'success', medium: 'warning', hard: 'error' };

// ── Tiny helper: render a parsed sampleData table ─────────────────────────────
function SampleTable({ tableData }) {
  if (!tableData?.columns?.length) return null;
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider' }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {tableData.columns.map((col) => (
              <TableCell key={col} sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.72rem', py: 0.5 }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.rows.map((row, ri) => (
            <TableRow key={ri} hover>
              {row.map((cell, ci) => (
                <TableCell key={ci} sx={{ fontFamily: 'monospace', fontSize: '0.72rem', py: 0.4 }}>
                  {cell === null ? <span style={{ opacity: 0.4 }}>NULL</span>
                    : cell === true  ? 'true'
                    : cell === false ? 'false'
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

// ── LeetCode-style example block ──────────────────────────────────────────────
function ExampleBlock({ index, tc }) {
  const tables         = tc?.sampleData || [];
  const expectedOutput = tc?.expectedOutput || null;
  return (
    <Box
      sx={{
        mt: 2.5, p: 2,
        border: '1px solid', borderColor: 'divider',
        borderRadius: 1.5, bgcolor: 'action.hover',
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: 'text.primary' }}>
        Example {index}
      </Typography>

      {/* Input tables */}
      {tables.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}
          >
            Input:
          </Typography>
          <Stack spacing={1.5}>
            {tables.map((tableData) => (
              <Box key={tableData.table}>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}
                >
                  {tableData.table}
                </Typography>
                <SampleTable tableData={tableData} />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Expected output */}
      {expectedOutput && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}
          >
            Output:
          </Typography>
          <SampleTable tableData={{ columns: expectedOutput.columns, rows: expectedOutput.rows || [] }} />
          {(expectedOutput.rowsCount != null || expectedOutput.rows?.length != null) && (
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              {expectedOutput.rowsCount ?? expectedOutput.rows?.length} row(s)
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

// ── Problem description panel (left) ──────────────────────────────────────────
function ProblemPanel({ problem, loading, testCases, tcLoading }) {
  const [tab, setTab] = useState(0); // 0 = Problem, 1 = Schema

  const q    = problem?.question;
  const meta = problem?.metadata;

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="rounded" width={70} height={24} sx={{ mb: 3 }} />
        {[100, 95, 80, 90, 70].map((w, i) => (
          <Skeleton key={i} variant="text" width={`${w}%`} sx={{ mb: 0.5 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Title + badges */}
      <Box sx={{ px: 3, pt: 3, pb: 2, flexShrink: 0 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {q?.title || '—'}
        </Typography>
        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
          {q?.difficulty && (
            <Chip
              label={q.difficulty}
              size="small"
              color={DIFFICULTY_COLOR[q.difficulty.toLowerCase()] || 'default'}
              variant="outlined"
              sx={{ fontWeight: 600, textTransform: 'capitalize' }}
            />
          )}
          {q?.type && (
            <Chip
              label={q.type}
              size="small"
              sx={{ fontSize: '0.7rem', fontWeight: 600, bgcolor: 'action.hover', color: 'text.secondary' }}
            />
          )}
          {q?.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.7rem', bgcolor: 'primary.lighter', color: 'primary.main' }} />
          ))}
        </Stack>
      </Box>

      {/* Tabs: Problem | Schema */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          minHeight: 36, flexShrink: 0,
          borderBottom: '1px solid', borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 36, py: 0, fontSize: '0.72rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
          },
        }}
      >
        <Tab icon={<ProblemIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Problem" />
        <Tab icon={<SchemaIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="Schema" />
      </Tabs>

      {/* Tab content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {tab === 0 ? (
          /* ── Problem tab ── */
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.9, whiteSpace: 'pre-wrap' }}
            >
              {q?.question || 'No description available.'}
            </Typography>

            {/* Examples */}
            {tcLoading ? (
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="rounded" height={28} width={100} sx={{ mb: 1.5 }} />
                <Skeleton variant="rounded" height={120} />
              </Box>
            ) : testCases?.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {testCases.map((tc, i) => (
                  <ExampleBlock
                    key={i}
                    index={i + 1}
                    tc={tc}
                  />
                ))}
              </Box>
            )}
          </Box>
        ) : (
          /* ── Schema tab ── */
          <Box sx={{ px: 3, py: 2.5 }}>
            {meta?.tables?.length > 0 ? (
              <Stack spacing={2.5}>
                {meta.tables.map((table) => (
                  <Box key={table.name}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ fontFamily: 'monospace' }}>
                      {table.name}
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Column</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Key</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {table.columns?.map((col) => (
                            <TableRow key={col.name}>
                              <TableCell sx={{ fontFamily: 'monospace', fontWeight: col.primary ? 700 : 400 }}>{col.name}</TableCell>
                              <TableCell sx={{ color: 'primary.main', fontFamily: 'monospace' }}>{col.type}</TableCell>
                              <TableCell>{col.primary ? 'PK' : col.foreignKey ? `FK → ${col.foreignKey}` : '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No schema info available.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Results / output panel (bottom-right) ─────────────────────────────────────
function ResultsPanel({ result, running, submitting }) {
  if (running || submitting) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%" gap={1.5} px={3}>
        <CircularProgress size={28} />
        <Typography variant="body2" color="text.secondary">
          {running ? 'Running query…' : 'Submitting and judging…'}
        </Typography>
      </Stack>
    );
  }

  if (!result) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%" gap={1} px={3}>
        <TerminalIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary">
          Run your query to see results here.
        </Typography>
      </Stack>
    );
  }

  // Error
  if (result.error) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'error.lighter', border: '1px solid', borderColor: 'error.light', borderRadius: 1 }}>
          <Typography variant="body2" color="error.main" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {result.error}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Submit result (verdict)
  if (result.verdict) {
    const passed = result.verdict === 'ACCEPTED';
    return (
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
          {passed ? <PassIcon color="success" /> : <FailIcon color="error" />}
          <Typography variant="subtitle1" fontWeight={700} color={passed ? 'success.main' : 'error.main'}>
            {passed ? 'Accepted' : result.verdict}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {result.passCount}/{result.totalCount} test cases passed
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={result.totalCount ? (result.passCount / result.totalCount) * 100 : 0}
          color={passed ? 'success' : 'error'}
          sx={{ borderRadius: 1, height: 6, mb: 2 }}
        />
        <SQLTestComparison testDetails={result.testDetails} />
      </Box>
    );
  }

  // Run result (RunTestcaseResponseDTO)
  const { passedCount, totalCount, totalExecutionMs, overallStatus, testDetails } = result;
  const passed = overallStatus === 'PASS' || overallStatus === 'PASSED' || overallStatus === 'ACCEPTED';

  return (
    <Box sx={{ p: 2, overflow: 'auto', height: '100%' }}>
      <Stack direction="row" alignItems="center" gap={2} mb={2} flexWrap="wrap">
        <Stack direction="row" alignItems="center" gap={0.5}>
          {passed ? <PassIcon color="success" fontSize="small" /> : <FailIcon color="error" fontSize="small" />}
          <Typography variant="subtitle2" fontWeight={700} color={passed ? 'success.main' : 'error.main'}>
            {overallStatus}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {passedCount}/{totalCount} passed
        </Typography>
        {totalExecutionMs != null && (
          <Typography variant="body2" color="text.secondary">
            {totalExecutionMs} ms
          </Typography>
        )}
      </Stack>

      <SQLTestComparison testDetails={testDetails} />
    </Box>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProblemSolver() {
  const { dbId, problemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme    = useTheme();

  const problemIds  = location.state?.problemIds;
  const currentIndex = problemIds ? problemIds.indexOf(problemId) : -1;
  const prevId = currentIndex > 0 ? problemIds[currentIndex - 1] : null;
  const nextId = currentIndex !== -1 && currentIndex < (problemIds?.length ?? 0) - 1
    ? problemIds[currentIndex + 1]
    : null;

  const goToProblem = (id) => {
    if (!id) return;
    navigate(`/sql/${dbId}/${id}`, { state: { problemIds } });
  };

  const [problem,    setProblem]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [query,      setQuery]      = useState('-- Write your SQL query here\nSELECT ');
  const [result,     setResult]     = useState(null);
  const [running,    setRunning]    = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Split sizes
  const [leftWidth,    setLeftWidth]    = useState(40);
  const [bottomHeight, setBottomHeight] = useState(35);
  const containerRef  = useRef(null);
  const draggingH     = useRef(false);
  const draggingV     = useRef(false);

  useEffect(() => {
    setLoading(true);
    setResult(null);
    loadProblemDetails(problemId).then((res) => {
      if (res.success) setProblem(res.data);
      setLoading(false);
    });
  }, [problemId]);

  const handleRun = async () => {
    if (!query.trim()) return;
    setRunning(true);
    setResult(null);
    const res = await runSQLQuery(problemId, query);
    setResult(res.success ? res.data : { error: res.message || 'Query failed.' });
    setRunning(false);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setSubmitting(true);
    setResult(null);
    const res = await submitSQLQuery(problemId, query);
    if (!res.success) {
      setResult({ error: res.message || 'Submission failed.' });
      setSubmitting(false);
      return;
    }
    const jobId = res.data?.jobId;
    if (!jobId) {
      setResult(res.data);
      setSubmitting(false);
      return;
    }
    // Poll until engine worker finishes
    const poll = async (attempts = 0) => {
      if (attempts > 40) {
        setResult({ error: 'Timed out waiting for result.' });
        setSubmitting(false);
        return;
      }
      const jobRes = await getJobResult(jobId);
      if (jobRes.success && jobRes.data?.verdict && jobRes.data.verdict !== 'PENDING') {
        setResult(jobRes.data);
        setSubmitting(false);
      } else {
        setTimeout(() => poll(attempts + 1), 1500);
      }
    };
    poll();
  };

  const runRef    = useRef(handleRun);
  const submitRef = useRef(handleSubmit);
  useEffect(() => {
    runRef.current    = handleRun;
    submitRef.current = handleSubmit;
  });

  const handleEditorMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => submitRef.current());
  };

  // Horizontal drag (left / right)
  const onMouseDownH = (e) => {
    e.preventDefault();
    draggingH.current = true;
    const onMove = (ev) => {
      if (!draggingH.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setLeftWidth(Math.min(Math.max(((ev.clientX - rect.left) / rect.width) * 100, 25), 70));
    };
    const onUp = () => {
      draggingH.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // Vertical drag (editor / output)
  const onMouseDownV = (e) => {
    e.preventDefault();
    draggingV.current = true;
    const onMove = (ev) => {
      if (!draggingV.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setBottomHeight(Math.min(Math.max(((rect.bottom - ev.clientY) / rect.height) * 100, 15), 60));
    };
    const onUp = () => {
      draggingV.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <Box
      ref={containerRef}
      sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {/* ── LEFT: Problem ── */}
      <Box
        sx={{
          width: `${leftWidth}%`, flexShrink: 0,
          display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
          borderRight: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
        }}
      >
        {/* Left toolbar */}
        <Stack
          direction="row" alignItems="center" gap={0.5}
          sx={{ px: 1.5, height: 44, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}
        >
          <Tooltip title="Back to problems">
            <IconButton size="small" onClick={() => navigate(`/sql/${dbId}`)}>
              <BackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Tooltip title="Previous problem">
            <span>
              <IconButton size="small" disabled={!prevId} onClick={() => goToProblem(prevId)}>
                <PrevIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Next problem">
            <span>
              <IconButton size="small" disabled={!nextId} onClick={() => goToProblem(nextId)}>
                <NextIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {currentIndex !== -1 && problemIds?.length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {currentIndex + 1} of {problemIds.length}
            </Typography>
          )}
        </Stack>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <ProblemPanel
            problem={problem}
            loading={loading}
            testCases={problem?.testCases || []}
            tcLoading={loading}
          />
        </Box>
      </Box>

      {/* ── HORIZONTAL DRAG HANDLE ── */}
      <Box
        onMouseDown={onMouseDownH}
        sx={{
          position: 'relative', width: 4, flexShrink: 0, cursor: 'col-resize',
          bgcolor: 'divider', '&:hover': { bgcolor: 'primary.main' },
          '&:hover .grip-icon': { opacity: 1 },
          transition: 'background-color 0.15s', zIndex: 10,
        }}
      >
        <HGripIcon
          className="grip-icon"
          sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            fontSize: 16, color: 'background.paper', opacity: 0,
            transition: 'opacity 0.15s', pointerEvents: 'none',
          }}
        />
      </Box>

      {/* ── RIGHT: Editor + Output ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minWidth: 0 }}>

        {/* Right toolbar */}
        <Stack
          direction="row" alignItems="center" gap={1}
          sx={{ px: 2, height: 44, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}
        >
          <FileIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            query.sql
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Run (Ctrl+Enter)">
            <span>
              <Button
                size="small" variant="outlined"
                startIcon={running ? <CircularProgress size={14} color="inherit" /> : <RunIcon />}
                onClick={handleRun}
                disabled={running || submitting}
                sx={{ minWidth: 90 }}
              >
                Run
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Submit (Ctrl+Shift+Enter)">
            <span>
              <Button
                size="small" variant="contained"
                startIcon={submitting ? <CircularProgress size={14} color="inherit" /> : <SubmitIcon />}
                onClick={handleSubmit}
                disabled={running || submitting}
                sx={{ minWidth: 100 }}
              >
                Submit
              </Button>
            </span>
          </Tooltip>
        </Stack>

        {/* Monaco editor */}
        <Box sx={{ height: `${100 - bottomHeight}%`, overflow: 'hidden', flexShrink: 0 }}>
          <Editor
            height="100%"
            language="sql"
            theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
            value={query}
            onChange={(val) => setQuery(val || '')}
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              padding: { top: 12 },
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            }}
          />
        </Box>

        {/* ── VERTICAL DRAG HANDLE ── */}
        <Box
          onMouseDown={onMouseDownV}
          sx={{
            position: 'relative', height: 4, flexShrink: 0, cursor: 'row-resize',
            bgcolor: 'divider', '&:hover': { bgcolor: 'primary.main' },
            '&:hover .grip-icon': { opacity: 1 },
            transition: 'background-color 0.15s', zIndex: 10,
          }}
        >
          <HGripIcon
            className="grip-icon"
            sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 16, color: 'background.paper', opacity: 0,
              transition: 'opacity 0.15s', pointerEvents: 'none',
            }}
          />
        </Box>

        {/* Bottom panel — Output only */}
        <Box
          sx={{
            height: `${bottomHeight}%`, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', bgcolor: 'background.paper',
          }}
        >
          {/* Output header */}
          <Stack
            direction="row" alignItems="center" gap={0.75}
            sx={{
              px: 2, minHeight: 36, flexShrink: 0,
              borderBottom: '1px solid', borderColor: 'divider',
            }}
          >
            <TerminalIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>
              Output
            </Typography>
          </Stack>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <ResultsPanel result={result} running={running} submitting={submitting} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
