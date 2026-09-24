import { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, Alert, CircularProgress, Paper, Chip, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { adminCreateTestCase, adminUpdateTestCase, adminDeleteTestCase, adminGetTestCaseByQuestion } from '../../api/adminApi.js';

const EMPTY_FORM = { questionId: '', type: '', expectedSql: '', testCases: '[]' };

export default function TestCaseManager() {
  const [questionIdInput, setQuestionIdInput] = useState('');
  const [current,         setCurrent]         = useState(null); // loaded testcase group
  const [loadError,       setLoadError]       = useState(null);
  const [loadBusy,        setLoadBusy]        = useState(false);

  const [formOpen,   setFormOpen]   = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formBusy,   setFormBusy]   = useState(false);
  const [formError,  setFormError]  = useState(null);
  const [jsonError,  setJsonError]  = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteBusy,  setDeleteBusy]  = useState(false);

  const handleLoad = async () => {
    if (!questionIdInput.trim()) return;
    setLoadBusy(true);
    setLoadError(null);
    setCurrent(null);
    const res = await adminGetTestCaseByQuestion(questionIdInput.trim());
    setLoadBusy(false);
    if (res.isSuccess()) setCurrent(res.getData());
    else setLoadError(res.message);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, questionId: questionIdInput.trim() });
    setFormError(null);
    setJsonError(false);
    setFormOpen(true);
  };

  const openEdit = () => {
    if (!current) return;
    setEditingId(current.id);
    setForm({
      questionId: current.questionId ?? questionIdInput.trim(),
      type: current.type ?? '',
      expectedSql: current.expectedSql ?? '',
      testCases: JSON.stringify(current.testCases ?? [], null, 2),
    });
    setFormError(null);
    setJsonError(false);
    setFormOpen(true);
  };

  const handleTestCasesChange = (val) => {
    setForm((f) => ({ ...f, testCases: val }));
    try { JSON.parse(val); setJsonError(false); } catch { setJsonError(true); }
  };

  const handleSave = async () => {
    if (jsonError) return;
    let parsedTestCases;
    try { parsedTestCases = JSON.parse(form.testCases); } catch { setJsonError(true); return; }

    setFormBusy(true);
    setFormError(null);
    const payload = { ...form, testCases: parsedTestCases };
    const res = editingId
      ? await adminUpdateTestCase(editingId, payload)
      : await adminCreateTestCase(payload);
    setFormBusy(false);
    if (res.isSuccess()) { setFormOpen(false); setCurrent(res.getData()); }
    else setFormError(res.message);
  };

  const handleDelete = async () => {
    if (!current) return;
    setDeleteBusy(true);
    const res = await adminDeleteTestCase(current.id);
    setDeleteBusy(false);
    setConfirmOpen(false);
    if (res.isSuccess()) setCurrent(null);
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
        <Button size="small" variant="contained" onClick={openCreate} disabled={!questionIdInput.trim()}>
          Create
        </Button>
      </Box>

      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      {current ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle2">TestCase Group — ID: <code>{current.id}</code></Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                {current.type && <Chip label={current.type} size="small" />}
                <Chip label={`${current.testCases?.length ?? 0} test cases`} size="small" variant="outlined" />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={openEdit}>Edit</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Delete</Button>
            </Box>
          </Box>
          {current.expectedSql && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary">Expected SQL</Typography>
              <Box component="pre" sx={{ mt: 0.5, p: 1, bgcolor: 'action.hover', borderRadius: 1, fontSize: 12, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                {current.expectedSql}
              </Box>
            </>
          )}
        </Paper>
      ) : !loadBusy && questionIdInput && (
        <Typography variant="body2" color="text.secondary">No testcase group found for this question.</Typography>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit TestCase Group' : 'New TestCase Group'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Question ID" value={form.questionId} onChange={(e) => setForm({ ...form, questionId: e.target.value })} size="small" required fullWidth />
            <TextField label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} size="small" fullWidth placeholder="e.g. SQL" />
          </Box>
          <TextField label="Expected SQL" value={form.expectedSql} onChange={(e) => setForm({ ...form, expectedSql: e.target.value })} size="small" multiline rows={3} fullWidth />
          <TextField
            label="Test Cases (JSON array)"
            value={form.testCases}
            onChange={(e) => handleTestCasesChange(e.target.value)}
            size="small" multiline rows={8} fullWidth
            error={jsonError}
            helperText={jsonError ? 'Invalid JSON' : 'Array of { id, type, numericTolerance, sampleData, expectedOutput }'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} disabled={formBusy}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={formBusy || jsonError || !form.questionId}>
            {formBusy ? <CircularProgress size={18} /> : editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete testcase group?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This is a hard delete — the testcase group and all its cases will be permanently removed.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleteBusy}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteBusy}>
            {deleteBusy ? <CircularProgress size={18} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
