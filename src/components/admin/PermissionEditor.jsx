import { useState } from 'react';
import {
  Box, Typography, Checkbox, FormControlLabel,
  Button, Alert, Chip, Divider, CircularProgress,
} from '@mui/material';
import { updateUserPermissions } from '../../api/adminApi.js';

const ALL_MODULES = ['SQL', 'NOSQL', 'VECTORDB'];
const ALL_OPS     = ['READ', 'WRITE', 'EXECUTE', 'EXPORT', 'DELETE'];

/**
 * permissions  - array of { moduleKey, operation, granted } from getUserDetail
 * adminScope   - config.data.adminScope: [{ moduleKey, grantableOperations }] — null for SUPERADMIN
 * role         - requester's role ('ADMIN' | 'SUPERADMIN')
 * userId       - target user's id
 * onSaved      - callback after successful save
 */
export default function PermissionEditor({ permissions, adminScope, role, userId, onSaved }) {
  // Build initial state map: `${module}.${op}` → boolean
  const buildState = () => {
    const map = {};
    ALL_MODULES.forEach((m) => ALL_OPS.forEach((op) => { map[`${m}.${op}`] = false; }));
    permissions?.forEach(({ moduleKey, operation, granted }) => {
      map[`${moduleKey}.${operation}`] = !!granted;
    });
    return map;
  };

  const [checked, setChecked]   = useState(buildState);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);
  const [success, setSuccess]   = useState(false);

  // Build allowed scope map for ADMIN: module → Set<op>
  const scopeMap = {};
  if (role === 'ADMIN' && adminScope) {
    adminScope.forEach(({ moduleKey, grantableOperations }) => {
      scopeMap[moduleKey] = new Set(grantableOperations ?? []);
    });
  }

  const isEditable = (module, op) => {
    if (role === 'SUPERADMIN') return true;
    return scopeMap[module]?.has(op) ?? false;
  };

  const handleToggle = (module, op) => {
    const key = `${module}.${op}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    const original = buildState();
    const grants  = [];
    const revokes = [];

    ALL_MODULES.forEach((m) => {
      const grantedOps  = [];
      const revokedOps  = [];
      ALL_OPS.forEach((op) => {
        const key   = `${m}.${op}`;
        const wasOn = original[key];
        const isOn  = checked[key];
        if (!wasOn && isOn) grantedOps.push(op);
        if (wasOn && !isOn) revokedOps.push(op);
      });
      if (grantedOps.length) grants.push({ moduleKey: m, operations: grantedOps });
      if (revokedOps.length) revokes.push({ moduleKey: m, operations: revokedOps });
    });

    if (!grants.length && !revokes.length) {
      setSuccess(true);
      return;
    }

    setSaving(true);
    setError(null);
    const res = await updateUserPermissions(userId, grants, revokes);
    setSaving(false);

    if (res.isSuccess()) {
      setSuccess(true);
      onSaved?.();
    } else {
      setError(res.message);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
        Permissions
      </Typography>

      {ALL_MODULES.map((module) => {
        const hasScope = role === 'SUPERADMIN' || (scopeMap[module]?.size > 0);
        return (
          <Box key={module} mb={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" fontWeight="600">
                {module}
              </Typography>
              {!hasScope && role === 'ADMIN' && (
                <Chip label="out of scope" size="small" sx={{ fontSize: 10 }} />
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, pl: 1 }}>
              {ALL_OPS.map((op) => {
                const editable = isEditable(module, op);
                return (
                  <FormControlLabel
                    key={op}
                    label={<Typography variant="caption">{op}</Typography>}
                    control={
                      <Checkbox
                        size="small"
                        checked={!!checked[`${module}.${op}`]}
                        disabled={!editable}
                        onChange={() => handleToggle(module, op)}
                      />
                    }
                    sx={{ mr: 0.5 }}
                  />
                );
              })}
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
        );
      })}

      {error   && <Alert severity="error"   sx={{ mb: 1 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 1 }}>Permissions saved</Alert>}

      <Button
        variant="contained"
        size="small"
        onClick={handleSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={14} /> : null}
      >
        Save permissions
      </Button>
    </Box>
  );
}
