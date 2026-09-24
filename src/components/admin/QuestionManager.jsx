import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Chip, Typography, Alert,
  CircularProgress, Tooltip, FormControl, InputLabel, Select,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon    from '@mui/icons-material/AddOutlined';
import { loadSQLDatasets, loadSQLQuestionSet } from '../../api/databaseApi.js';
import { adminCreateQuestion, adminUpdateQuestion, adminDeleteQuestion } from '../../api/adminApi.js';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const toArray = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const toStr   = (a) => (Array.isArray(a) ? a.join(', ') : a ?? '');

const EMPTY = {
  datasetId: '', title: '', question: '', difficulty: 'MEDIUM',
  type: '', tags: '', tableNames: '',
};

export default function QuestionManager() {
  const [datasets,    setDatasets]    = useState([]);
  const [datasetId,   setDatasetId]   = useState('');
  const [questions,   setQuestions]   = useState([]);
  const [qLoading,    setQLoading]    = useState(false);
  const [error,       setError]       = useState(null);

  const [formOpen,    setFormOpen]    = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [form,        setForm]        = useState(EMPTY);
  const [formBusy,    setFormBusy]    = useState(false);
  const [formError,   setFormError]   = useState(null);

  const [confirmId,   setConfirmId]   = useState(null);
  const [deleteBusy,  setDeleteBusy]  = useState(false);

  useEffect(() => {
    loadSQLDatasets({ page: 0, size: 200 }).then((res) => {
      if (res.isSuccess()) setDatasets(res.getData()?.content ?? []);
    });
  }, []);

  const loadQuestions = (dsId) => {
    if (!dsId) return;
    setQLoading(true);
    setError(null);
    loadSQLQuestionSet(dsId).then((res) => {
      setQLoading(false);
      if (res.isSuccess()) setQuestions(res.getData() ?? []);
      else setError(res.message);
    });
  };

  const handleDatasetChange = (id) => {
    setDatasetId(id);
    setQuestions([]);
    loadQuestions(id);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY, datasetId });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (q) => {
    setEditingId(q.id);
    setForm({
      datasetId: q.datasetId ?? datasetId,
      title: q.title ?? '', question: q.question ?? '',
      difficulty: q.difficulty ?? 'MEDIUM', type: q.type ?? '',
      tags: toStr(q.tags), tableNames: toStr(q.tableNames),
    });
    setFormError(null);
    setFormOpen(true);
  };

  const handleSave = async () => {
    setFormBusy(true);
    setFormError(null);
    const payload = { ...form, tags: toArray(form.tags), tableNames: toArray(form.tableNames) };
    const res = editingId
      ? await adminUpdateQuestion(editingId, payload)
      : await adminCreateQuestion(payload);
    setFormBusy(false);
    if (res.isSuccess()) { setFormOpen(false); loadQuestions(datasetId); }
    else setFormError(res.message);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    const res = await adminDeleteQuestion(confirmId);
    setDeleteBusy(false);
    setConfirmId(null);
    if (res.isSuccess()) loadQuestions(datasetId);
    else setError(res.message);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 280 }}>
          <InputLabel>Select Dataset</InputLabel>
          <Select label="Select Dataset" value={datasetId} onChange={(e) => handleDatasetChange(e.target.value)}>
            {datasets.map((d) => (
              <MenuItem key={d.id} value={d.id}>{d.title} <Typography variant="caption" color="text.secondary" ml={1}>({d.id})</Typography></MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openCreate} disabled={!datasetId}>
          New Question
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                <TableRow><TableCell colSpan={5} align="center"><Typography variant="body2" color="text.secondary" py={3}>No questions</Typography></TableCell></TableRow>
              ) : questions.map((q) => (
                <TableRow key={q.id} hover>
                  <TableCell><Typography variant="caption" color="text.secondary">{q.id}</Typography></TableCell>
                  <TableCell>{q.title}</TableCell>
                  <TableCell><Chip label={q.difficulty} size="small" color={q.difficulty === 'EASY' ? 'success' : q.difficulty === 'HARD' ? 'error' : 'warning'} /></TableCell>
                  <TableCell><Typography variant="caption">{q.type}</Typography></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(q)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Soft delete"><IconButton size="small" color="error" onClick={() => setConfirmId(q.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary" py={2}>Select a dataset to view its questions.</Typography>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Question' : 'New Question'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Dataset ID" value={form.datasetId} onChange={(e) => setForm({ ...form, datasetId: e.target.value })} size="small" required fullWidth />
          <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} size="small" required fullWidth />
          <TextField label="Question (problem statement)" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} size="small" multiline rows={4} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField select label="Difficulty" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} size="small" fullWidth>
              {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} size="small" fullWidth placeholder="e.g. SELECT" />
          </Box>
          <TextField label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} size="small" fullWidth />
          <TextField label="Table Names (comma-separated)" value={form.tableNames} onChange={(e) => setForm({ ...form, tableNames: e.target.value })} size="small" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={formBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={formBusy || !form.datasetId || !form.title}>
            {formBusy ? <CircularProgress size={18} /> : editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Soft-delete question?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">The question will be hidden from users (<code>deleted_at</code> is set) and the dataset question count will be decremented.</Typography>
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
