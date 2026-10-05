import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Chip, Typography, Alert,
  CircularProgress, Tooltip, Switch, FormControlLabel,
} from '@mui/material';
import EditIcon   from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon    from '@mui/icons-material/AddOutlined';
import { loadSQLDatasets } from '../../api/databaseApi.js';
import { adminCreateDataset, adminUpdateDataset, adminDeleteDataset } from '../../api/adminApi.js';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const DATA_TYPES   = ['SQL', 'NOSQL', 'VECTORDB'];
const toArray = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const toStr   = (a) => (Array.isArray(a) ? a.join(', ') : a ?? '');

const EMPTY = {
  title: '', description: '', icon: '',
  difficulty: 'MEDIUM', dataType: 'SQL', estimatedTime: '',
  tableNames: [], tags: '', categories: '', skills: '', modesAvailable: '',
  active: 0,
};

export default function DatasetManager() {
  const [datasets,   setDatasets]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const [formOpen,   setFormOpen]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY);
  const [formBusy,   setFormBusy]   = useState(false);
  const [formError,  setFormError]  = useState(null);

  const [confirmId,  setConfirmId]  = useState(null); // { id, dataType }
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    loadSQLDatasets({ page: 0, size: 200 }).then((res) => {
      setLoading(false);
      if (res.isSuccess()) setDatasets(res.getData()?.items ?? []);
      else setError(res.message);
    });
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({
      title: d.title ?? '',
      description: d.description ?? '',
      icon: d.icon ?? '',
      difficulty: d.difficulty ?? 'MEDIUM',
      dataType: d.dataType ?? 'SQL',
      estimatedTime: d.estimatedTime ?? '',
      tableNames: d.tableNames ?? [],
      tags: toStr(d.tags),
      categories: toStr(d.categories),
      skills: toStr(d.skills),
      modesAvailable: toStr(d.modesAvailable),
      active: d.active ?? 0,
    });
    setFormError(null);
    setFormOpen(true);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const isSaveDisabled = () =>
    formBusy ||
    !form.title.trim() ||
    !form.description.trim() ||
    !form.estimatedTime.trim() ||
    toArray(form.tags).length === 0 ||
    toArray(form.skills).length === 0 ||
    form.tableNames.length === 0 ||
    form.tableNames.some((n) => !n.trim());

  const handleSave = async () => {
    setFormBusy(true);
    setFormError(null);
    const payload = {
      title:          form.title,
      description:    form.description,
      icon:           form.icon,
      difficulty:     form.difficulty,
      dataType:       form.dataType,
      estimatedTime:  form.estimatedTime,
      tableNames:     form.tableNames,
      tags:           toArray(form.tags),
      categories:     toArray(form.categories),
      skills:         toArray(form.skills),
      modesAvailable: toArray(form.modesAvailable),
      active:         form.active,
    };
    const res = editingId
      ? await adminUpdateDataset(editingId, payload)
      : await adminCreateDataset(payload);
    setFormBusy(false);
    if (res.isSuccess()) { setFormOpen(false); load(); }
    else setFormError(res.message);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    const res = await adminDeleteDataset(confirmId.id, confirmId.dataType);
    setDeleteBusy(false);
    setConfirmId(null);
    if (res.isSuccess()) load();
    else setError(res.message);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {loading ? 'Loading…' : `${datasets.length} dataset(s)`}
        </Typography>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New Dataset
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} /></Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Difficulty</b></TableCell>
                <TableCell><b>Tables</b></TableCell>
                <TableCell><b>Questions</b></TableCell>
                <TableCell><b>Active</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datasets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>No datasets found</Typography>
                  </TableCell>
                </TableRow>
              ) : datasets.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell><Typography variant="caption" color="text.secondary">{d.id}</Typography></TableCell>
                  <TableCell>{d.title}</TableCell>
                  <TableCell><Chip label={d.dataType} size="small" /></TableCell>
                  <TableCell>
                    <Chip
                      label={d.difficulty}
                      size="small"
                      color={d.difficulty === 'EASY' ? 'success' : d.difficulty === 'HARD' ? 'error' : 'warning'}
                    />
                  </TableCell>
                  <TableCell>{d.tableCount}</TableCell>
                  <TableCell>{d.questions}</TableCell>
                  <TableCell>
                    <Chip
                      label={d.active === 1 ? 'Active' : 'Inactive'}
                      size="small"
                      color={d.active === 1 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(d)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Soft delete">
                      <IconButton size="small" color="error" onClick={() => setConfirmId({ id: d.id, dataType: d.dataType })}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Dataset' : 'New Dataset'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}

          {/* Title */}
          <TextField
            label="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            size="small" fullWidth
          />

          {/* Description */}
          <TextField
            label="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            size="small" multiline rows={2} fullWidth
          />

          {/* Data Type + Difficulty */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              select label="Data Type" value={form.dataType}
              onChange={(e) => setForm({ ...form, dataType: e.target.value })}
              size="small" fullWidth
            >
              {DATA_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField
              select label="Difficulty *" value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              size="small" fullWidth
            >
              {DIFFICULTIES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Box>

          {/* Icon + Estimated Time */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Icon URL"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              size="small" fullWidth
            />
            <TextField
              label="Estimated Time *"
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              size="small" fullWidth
              placeholder="e.g. 30 mins"
            />
          </Box>

          {/* Tags */}
          <TextField
            label="Tags * (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            size="small" fullWidth
          />

          {/* Categories */}
          <TextField
            label="Categories (comma-separated)"
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            size="small" fullWidth
          />

          {/* Skills */}
          <TextField
            label="Skills * (comma-separated)"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            size="small" fullWidth
          />

          {/* Modes */}
          <TextField
            label="Modes Available (comma-separated)"
            value={form.modesAvailable}
            onChange={(e) => setForm({ ...form, modesAvailable: e.target.value })}
            size="small" fullWidth
            placeholder="e.g. MySQL, PostgreSQL"
          />

          {/* Table Names */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color={form.tableNames.length === 0 ? 'error' : 'text.secondary'}>
                Tables *{form.tableNames.length === 0 && ' — at least one required'}
              </Typography>
              <Button size="small" startIcon={<AddIcon />}
                onClick={() => setForm((f) => ({ ...f, tableNames: [...f.tableNames, ''] }))}>
                Add
              </Button>
            </Box>
            {form.tableNames.map((name, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small" fullWidth placeholder="Table name"
                  value={name}
                  onChange={(e) => setForm((f) => ({
                    ...f, tableNames: f.tableNames.map((n, idx) => idx === i ? e.target.value : n),
                  }))}
                  error={!name.trim()}
                />
                <IconButton size="small" onClick={() => setForm((f) => ({
                  ...f, tableNames: f.tableNames.filter((_, idx) => idx !== i),
                }))}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Active toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={form.active === 1}
                onChange={(e) => setForm({ ...form, active: e.target.checked ? 1 : 0 })}
              />
            }
            label={
              <Typography variant="body2">
                {form.active === 1 ? 'Active — visible to users' : 'Inactive — hidden from users'}
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={formBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={isSaveDisabled()}>
            {formBusy ? <CircularProgress size={18} /> : editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Soft-delete dataset?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will set <code>deleted_at</code> and hide the dataset from all views. It can be restored manually.
          </Typography>
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
