import { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Alert, CircularProgress, Paper, Chip, Divider,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, IconButton, Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import EditIcon   from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon    from '@mui/icons-material/AddOutlined';
import { adminCreateSolution, adminUpdateSolution, adminDeleteSolution } from '../../api/adminApi.js';
import api from '../../api/globalApi.js';
import { ApiResponse } from '../../utils/classes/ApiResponse.js';

const EMPTY_FORM = { questionId: '', datasetId: '', sqlMode: '', solutions: '[]' };

const loadSolutions = async (questionId) => {
  try {
    const res = await api.get(`/db/sql/problem/${questionId}/expected`);
    if (res.status === 200) return ApiResponse.success(res.data.message, res.data.data);
    return ApiResponse.error(res.data.message);
  } catch (e) {
    return ApiResponse.error(e.response?.data?.message || 'Failed to load');
  }
};

export default function SolutionManager() {
  const [questionIdInput, setQuestionIdInput] = useState('');
  const [solutions,       setSolutions]       = useState([]);
  const [loadError,       setLoadError]       = useState(null);
  const [loadBusy,        setLoadBusy]        = useState(false);

  const [formOpen,   setFormOpen]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formBusy,   setFormBusy]   = useState(false);
  const [formError,  setFormError]  = useState(null);
  const [jsonError,  setJsonError]  = useState(false);

  const [confirmId,   setConfirmId]  = useState(null);
  const [deleteBusy,  setDeleteBusy] = useState(false);

  const handleLoad = async () => {
    if (!questionIdInput.trim()) return;
    setLoadBusy(true);
    setLoadError(null);
    setSolutions([]);
    const res = await loadSolutions(questionIdInput.trim());
    setLoadBusy(false);
    if (res.isSuccess()) {
      const data = res.getData();
      setSolutions(Array.isArray(data) ? data : data ? [data] : []);
    } else {
      setLoadError(res.message);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, questionId: questionIdInput.trim() });
    setFormError(null);
    setJsonError(false);
    setFormOpen(true);
  };

  const openEdit = (sol) => {
    setEditingId(sol.id);
    setForm({
      questionId: sol.questionId ?? questionIdInput.trim(),
      datasetId: sol.datasetId ?? '',
      sqlMode: sol.sqlMode ?? '',
      solutions: JSON.stringify(sol.solutions ?? [], null, 2),
    });
    setFormError(null);
    setJsonError(false);
    setFormOpen(true);
  };

  const handleSolutionsChange = (val) => {
    setForm((f) => ({ ...f, solutions: val }));
    try { JSON.parse(val); setJsonError(false); } catch { setJsonError(true); }
  };

  const handleSave = async () => {
    if (jsonError) return;
    let parsedSolutions;
    try { parsedSolutions = JSON.parse(form.solutions); } catch { setJsonError(true); return; }

    setFormBusy(true);
    setFormError(null);
    const payload = { ...form, solutions: parsedSolutions };
    const res = editingId
      ? await adminUpdateSolution(editingId, payload)
      : await adminCreateSolution(payload);
    setFormBusy(false);
    if (res.isSuccess()) { setFormOpen(false); handleLoad(); }
    else setFormError(res.message);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    const res = await adminDeleteSolution(confirmId);
    setDeleteBusy(false);
    setConfirmId(null);
    if (res.isSuccess()) handleLoad();
    else setLoadError(res.message);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
        <TextField
          label="Question ID" size="small" value={questionIdInput}
          onChange={(e) => setQuestionIdInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
          sx={{ width: 200 }}
        />
        <Button
          variant="outlined" size="small"
          startIcon={loadBusy ? <CircularProgress size={14} /> : <SearchIcon />}
          disabled={loadBusy || !questionIdInput.trim()}
          onClick={handleLoad}
        >
          Load
        </Button>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openCreate} disabled={!questionIdInput.trim()}>
          Create
        </Button>
      </Box>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      {solutions.length > 0 ? (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Dataset ID</b></TableCell>
                <TableCell><b>SQL Mode</b></TableCell>
                <TableCell><b>Solutions</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solutions.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell><Typography variant="caption" color="text.secondary">{s.id}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{s.datasetId}</Typography></TableCell>
                  <TableCell><Chip label={s.sqlMode || '—'} size="small" /></TableCell>
                  <TableCell><Typography variant="caption">{s.solutions?.length ?? 0} entries</Typography></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setConfirmId(s.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : !loadBusy && questionIdInput && (
        <Typography variant="body2" color="text.secondary">No expected solutions found for this question.</Typography>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Expected Solution' : 'New Expected Solution'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Question ID" value={form.questionId} onChange={(e) => setForm({ ...form, questionId: e.target.value })} size="small" required fullWidth />
            <TextField label="Dataset ID" value={form.datasetId} onChange={(e) => setForm({ ...form, datasetId: e.target.value })} size="small" required fullWidth />
          </Box>
          <TextField label="SQL Mode" value={form.sqlMode} onChange={(e) => setForm({ ...form, sqlMode: e.target.value })} size="small" sx={{ width: 200 }} placeholder="e.g. STANDARD" />
          <TextField
            label="Solutions (JSON array)"
            value={form.solutions}
            onChange={(e) => handleSolutionsChange(e.target.value)}
            size="small" multiline rows={10} fullWidth
            error={jsonError}
            helperText={jsonError ? 'Invalid JSON' : 'Array of { solutionQuery, resultHash, expectedOutput: { columns, rows, rowsCount } }'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={formBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={formBusy || jsonError || !form.questionId || !form.datasetId}>
            {formBusy ? <CircularProgress size={18} /> : editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete expected solution?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This is a hard delete and cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)} disabled={deleteBusy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteBusy}>
            {deleteBusy ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
