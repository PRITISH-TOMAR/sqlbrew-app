import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, Divider, Checkbox, FormControlLabel,
  Alert, Button, CircularProgress, Accordion, AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { listAdminScopes, setAdminScope } from '../../api/adminApi.js';

const ALL_MODULES = ['SQL', 'NOSQL', 'VECTORDB'];
const ALL_OPS     = ['READ', 'WRITE', 'EXECUTE', 'EXPORT', 'DELETE'];

function AdminScopeEditor({ admin, onSaved }) {
  // Build initial scope map from existing scopes
  const buildChecked = () => {
    const map = {};
    ALL_MODULES.forEach((m) => ALL_OPS.forEach((op) => { map[`${m}.${op}`] = false; }));
    admin.scopes?.forEach(({ moduleKey, grantableOps }) => {
      grantableOps?.forEach((op) => { map[`${moduleKey}.${op}`] = true; });
    });
    return map;
  };

  const [checked,  setChecked]  = useState(buildChecked);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);

  const toggle = (module, op) => {
    setChecked((prev) => ({ ...prev, [`${module}.${op}`]: !prev[`${module}.${op}`] }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    let failed = false;
    for (const module of ALL_MODULES) {
      const grantableOps = ALL_OPS.filter((op) => checked[`${module}.${op}`]);
      const existing     = admin.scopes?.find((s) => s.moduleKey === module)?.grantableOps ?? [];
      const hasChanged   =
        grantableOps.length !== existing.length ||
        grantableOps.some((op) => !existing.includes(op));

      if (hasChanged) {
        const res = await setAdminScope(admin.userId, module, grantableOps);
        if (!res.isSuccess()) {
          setError(res.message);
          failed = true;
          break;
        }
      }
    }

    setSaving(false);
    if (!failed) {
      setSuccess(true);
      onSaved?.();
    }
  };

  return (
    <Box>
      {ALL_MODULES.map((module) => (
        <Box key={module} mb={1.5}>
          <Typography variant="body2" fontWeight="600" mb={0.5}>{module}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
            {ALL_OPS.map((op) => (
              <FormControlLabel
                key={op}
                label={<Typography variant="caption">{op}</Typography>}
                control={
                  <Checkbox
                    size="small"
                    checked={!!checked[`${module}.${op}`]}
                    onChange={() => toggle(module, op)}
                  />
                }
                sx={{ mr: 0.5 }}
              />
            ))}
          </Box>
          <Divider sx={{ mt: 0.5 }} />
        </Box>
      ))}

      {error   && <Alert severity="error"   sx={{ mb: 1 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }}>Scope updated</Alert>}

      <Button
        variant="contained"
        size="small"
        onClick={handleSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={14} /> : null}
      >
        Save scope
      </Button>
    </Box>
  );
}

export default function ScopesTab() {
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    listAdminScopes().then((res) => {
      setLoading(false);
      if (res.isSuccess()) setAdmins(res.getData() ?? []);
      else setError(res.message);
    });
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Define which operations each admin is allowed to grant to users.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {admins.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No admins found.</Typography>
      ) : (
        admins.map((admin) => (
          <Accordion key={admin.userId} variant="outlined" sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="body2" fontWeight="600">{admin.name}</Typography>
                <Typography variant="caption" color="text.secondary">{admin.email}</Typography>
                <Chip
                  label={admin.status}
                  size="small"
                  color={admin.status === 'ACTIVE' ? 'success' : 'error'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <AdminScopeEditor admin={admin} onSaved={load} />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}
