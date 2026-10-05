import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, OutlinedInput, Checkbox, ListItemText,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Chip, Typography,
  Alert, CircularProgress, Tooltip, Switch, FormControlLabel,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import SearchIcon  from '@mui/icons-material/Search';
import AddIcon     from '@mui/icons-material/AddOutlined';
import EditIcon    from '@mui/icons-material/EditOutlined';
import DeleteIcon  from '@mui/icons-material/DeleteOutlined';
import { loadDatasetsByModule } from '../../api/databaseApi.js';
import { adminCreateDataset, adminUpdateDataset, adminDeleteDataset } from '../../api/adminApi.js';
import QuestionManager from './QuestionManager.jsx';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];
const DATA_TYPES   = ['SQL', 'NOSQL', 'VECTORDB'];
const DIFF_COLOR   = { EASY: 'success', MEDIUM: 'warning', HARD: 'error' };
const toArray = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);
const toStr   = (a) => (Array.isArray(a) ? a.join(', ') : a ?? '');

const EMPTY_FORM = {
  title: '', description: '', icon: '',
  difficulty: 'MEDIUM', dataType: 'SQL', estimatedTime: '',
  tableNames: [], tags: '', categories: '', skills: '', modesAvailable: '',
  active: 0,
};

export default function ContentTab() {
  // Module options from Redux config (populated by /config on app load)
  const configModules = useSelector((s) => s.config.data?.modules ?? []);
  const moduleOptions = DATA_TYPES.filter((t) => {
    const entry = configModules.find((c) => c.key === t);
    return !entry || entry.enabled !== false;
  });

  // ── Dataset state ──────────────────────────────────────────────────────────
  const [allDatasets, setAllDatasets] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadError,   setLoadError]   = useState(null);

  // ── Filters ────────────────────────────────────────────────────────────────
  const [filterModules,    setFilterModules]    = useState([]);
  const [filterSearch,     setFilterSearch]     = useState('');
  const [filterActive,     setFilterActive]     = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState([]);

  // ── Selected dataset → drives QuestionManager ─────────────────────────────
  const [selectedDataset, setSelectedDataset] = useState(null);

  // ── Form dialog ────────────────────────────────────────────────────────────
  const [formOpen,  setFormOpen]  = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [formBusy,  setFormBusy]  = useState(false);
  const [formError, setFormError] = useState(null);

  // ── Delete confirm ─────────────────────────────────────────────────────────
  const [confirmId,  setConfirmId]  = useState(null); // { id, dataType }
  const [deleteBusy, setDeleteBusy] = useState(false);

  // ── Load datasets from every enabled module in parallel ───────────────────
  const loadAll = () => {
    setLoading(true);
    setLoadError(null);
    Promise.all(
      moduleOptions.map((m) =>
        loadDatasetsByModule(m, { page: 0, size: 500 })
          .then((res) => (res.isSuccess() ? (res.getData()?.items ?? []) : []))
          .catch(() => [])
      )
    ).then((results) => {
      setAllDatasets(results.flat());
      setLoading(false);
    });
  };

  useEffect(() => { loadAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filtered = useMemo(() => allDatasets.filter((d) => {
    if (filterModules.length    && !filterModules.includes(d.dataType))                              return false;
    if (filterSearch.trim()     && !d.title.toLowerCase().includes(filterSearch.trim().toLowerCase())) return false;
    if (filterActive.length) {
      const label = d.active === 1 ? 'Active' : 'Inactive';
      if (!filterActive.includes(label)) return false;
    }
    if (filterDifficulty.length && !filterDifficulty.includes(d.difficulty))                        return false;
    return true;
  }), [allDatasets, filterModules, filterSearch, filterActive, filterDifficulty]);

  // ── Multi-select handler ───────────────────────────────────────────────────
  const onMulti = (setter) => (e) => {
    const v = e.target.value;
    setter(typeof v === 'string' ? v.split(',') : v);
  };

  // ── Save validation ────────────────────────────────────────────────────────
  const isSaveDisabled = () =>
    formBusy ||
    !form.title.trim() ||
    !form.description.trim() ||
    !form.estimatedTime.trim() ||
    toArray(form.tags).length === 0 ||
    toArray(form.skills).length === 0 ||
    form.tableNames.length === 0 ||
    form.tableNames.some((n) => !n.trim());

  // ── Open dialogs ───────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (e, d) => {
    e.stopPropagation();
    setEditingId(d.id);
    setForm({
      title:          d.title ?? '',
      description:    d.description ?? '',
      icon:           d.icon ?? '',
      difficulty:     d.difficulty ?? 'MEDIUM',
      dataType:       d.dataType ?? 'SQL',
      estimatedTime:  d.estimatedTime ?? '',
      tableNames:     d.tableNames ?? [],
      tags:           toStr(d.tags),
      categories:     toStr(d.categories),
      skills:         toStr(d.skills),
      modesAvailable: toStr(d.modesAvailable),
      active:         d.active ?? 0,
    });
    setFormError(null);
    setFormOpen(true);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
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
    if (res.isSuccess()) { setFormOpen(false); loadAll(); }
    else setFormError(res.message);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteBusy(true);
    const res = await adminDeleteDataset(confirmId.id, confirmId.dataType);
    setDeleteBusy(false);
    setConfirmId(null);
    if (res.isSuccess()) {
      if (selectedDataset?.id === confirmId.id) setSelectedDataset(null);
      loadAll();
    } else {
      setLoadError(res.message);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>

        {/* Module multi-select — values from /config (Redux) */}
        <FormControl size="small" sx={{ minWidth: 155 }}>
          <InputLabel shrink>Module</InputLabel>
          <Select
            multiple
            value={filterModules}
            onChange={onMulti(setFilterModules)}
            input={<OutlinedInput notched label="Module" />}
            renderValue={(sel) => (sel.length ? sel.join(', ') : 'All')}
            displayEmpty
          >
            {moduleOptions.map((m) => (
              <MenuItem key={m} value={m}>
                <Checkbox checked={filterModules.includes(m)} size="small" />
                <ListItemText primary={m} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search title…"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Active multi-select */}
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel shrink>Active</InputLabel>
          <Select
            multiple
            value={filterActive}
            onChange={onMulti(setFilterActive)}
            input={<OutlinedInput notched label="Active" />}
            renderValue={(sel) => (sel.length ? sel.join(', ') : 'All')}
            displayEmpty
          >
            {['Active', 'Inactive'].map((v) => (
              <MenuItem key={v} value={v}>
                <Checkbox checked={filterActive.includes(v)} size="small" />
                <ListItemText primary={v} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Difficulty multi-select */}
        <FormControl size="small" sx={{ minWidth: 155 }}>
          <InputLabel shrink>Difficulty</InputLabel>
          <Select
            multiple
            value={filterDifficulty}
            onChange={onMulti(setFilterDifficulty)}
            input={<OutlinedInput notched label="Difficulty" />}
            renderValue={(sel) => (sel.length ? sel.join(', ') : 'All')}
            displayEmpty
          >
            {DIFFICULTIES.map((d) => (
              <MenuItem key={d} value={d}>
                <Checkbox checked={filterDifficulty.includes(d)} size="small" />
                <ListItemText primary={d} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Add Dataset — far right */}
        <Button
          size="small" variant="contained" startIcon={<AddIcon />}
          onClick={openCreate} sx={{ ml: 'auto' }}
        >
          Add Dataset
        </Button>
      </Box>

      {/* Count + error */}
      {!loading && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {filtered.length} of {allDatasets.length} dataset(s)
        </Typography>
      )}
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      {/* ── Dataset table ────────────────────────────────────────────────────── */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Module</b></TableCell>
                <TableCell><b>Active</b></TableCell>
                <TableCell><b>Difficulty</b></TableCell>
                <TableCell><b>Questions</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>
                      {allDatasets.length === 0 ? 'No datasets found' : 'No datasets match the filters'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.map((d) => (
                <TableRow
                  key={d.id}
                  hover
                  onClick={() => setSelectedDataset(selectedDataset?.id === d.id ? null : d)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedDataset?.id === d.id ? 'action.selected' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{d.id}</Typography>
                  </TableCell>
                  <TableCell>{d.title}</TableCell>
                  <TableCell>
                    <Chip label={d.dataType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={d.active === 1 ? 'Active' : 'Inactive'}
                      size="small"
                      color={d.active === 1 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={d.difficulty}
                      size="small"
                      color={DIFF_COLOR[d.difficulty] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>{d.questions}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={(e) => openEdit(e, d)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Soft delete">
                      <IconButton
                        size="small" color="error"
                        onClick={() => setConfirmId({ id: d.id, dataType: d.dataType })}
                      >
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

      {/* ── Question manager panel ─────────────────────────────────────────── */}
      {selectedDataset && (
        <Box
          sx={{
            mt: 3,
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">{selectedDataset.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedDataset.dataType} · ID {selectedDataset.id}
              </Typography>
            </Box>
            <Button size="small" onClick={() => setSelectedDataset(null)}>
              Close
            </Button>
          </Box>
          <QuestionManager dataset={selectedDataset} />
        </Box>
      )}

      {/* ══ Create / Edit Dialog ════════════════════════════════════════════ */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Dataset' : 'New Dataset'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label="Title *" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Description *" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            size="small" multiline rows={2} fullWidth
          />
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Icon URL" value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              size="small" fullWidth
            />
            <TextField
              label="Estimated Time *" value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              size="small" fullWidth placeholder="e.g. 30 mins"
            />
          </Box>
          <TextField
            label="Tags * (comma-separated)" value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Categories (comma-separated)" value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Skills * (comma-separated)" value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            size="small" fullWidth
          />
          <TextField
            label="Modes Available (comma-separated)" value={form.modesAvailable}
            onChange={(e) => setForm({ ...form, modesAvailable: e.target.value })}
            size="small" fullWidth placeholder="e.g. MySQL, PostgreSQL"
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

      {/* ══ Delete Confirm ══════════════════════════════════════════════════ */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Soft-delete dataset?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Sets <code>deleted_at</code> and hides the dataset from all views. Can be restored manually.
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
