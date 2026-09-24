import { useEffect, useState } from 'react';
import {
  Drawer, Box, Typography, Chip, Divider, Button,
  MenuItem, Select, FormControl, InputLabel,
  Alert, CircularProgress, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { useSelector } from 'react-redux';
import { getUserDetail, updateUserStatus, updateUserRole } from '../../api/adminApi.js';
import PermissionEditor from './PermissionEditor.jsx';

const DRAWER_WIDTH = 480;

const ROLE_CHIP_COLOR = {
  SUPERADMIN: 'error',
  ADMIN:      'warning',
  USER:       'default',
};

const STATUS_CHIP_COLOR = {
  ACTIVE:  'success',
  BLOCKED: 'error',
};

function roleRank(role) {
  const ranks = { SUPERADMIN: 3, ADMIN: 2, USER: 1 };
  return ranks[role?.toUpperCase()] ?? 0;
}

export default function UserDetailDrawer({ open, userId, onClose, onUpdate }) {
  const requesterRole = useSelector((s) => s.config.data?.role);
  const adminScope    = useSelector((s) => s.config.data?.adminScope);

  const [detail,       setDetail]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [actionError,  setActionError]  = useState(null);
  const [actionBusy,   setActionBusy]   = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (!open || !userId) return;
    setDetail(null);
    setActionError(null);
    setLoading(true);
    getUserDetail(userId).then((res) => {
      setLoading(false);
      if (res.isSuccess()) {
        setDetail(res.getData());
        setSelectedRole(res.getData().role);
      }
    });
  }, [open, userId]);

  const handleStatusToggle = async () => {
    setActionBusy(true);
    setActionError(null);
    const newStatus = detail.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const res = await updateUserStatus(userId, newStatus);
    setActionBusy(false);
    if (res.isSuccess()) {
      setDetail((d) => ({ ...d, status: newStatus }));
      onUpdate?.();
    } else {
      setActionError(res.message);
    }
  };

  const handleRoleChange = async () => {
    if (selectedRole === detail.role) return;
    setActionBusy(true);
    setActionError(null);
    const res = await updateUserRole(userId, selectedRole);
    setActionBusy(false);
    if (res.isSuccess()) {
      setDetail((d) => ({ ...d, role: selectedRole }));
      onUpdate?.();
    } else {
      setActionError(res.message);
      setSelectedRole(detail.role);
    }
  };

  // Roles that the requester is allowed to assign (strictly below their rank)
  const assignableRoles = ['USER', 'ADMIN', 'SUPERADMIN'].filter(
    (r) => roleRank(requesterRole) > roleRank(r)
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: DRAWER_WIDTH, p: 3, overflowY: 'auto' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">User Detail</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      )}

      {!loading && !detail && (
        <Typography color="text.secondary">Failed to load user.</Typography>
      )}

      {detail && (
        <>
          {/* Identity */}
          <Typography variant="subtitle1" fontWeight="600">{detail.name}</Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>{detail.email}</Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={detail.role}
              size="small"
              color={ROLE_CHIP_COLOR[detail.role] ?? 'default'}
            />
            <Chip
              label={detail.status}
              size="small"
              color={STATUS_CHIP_COLOR[detail.status] ?? 'default'}
            />
          </Box>

          <Typography variant="caption" color="text.disabled">
            Joined {detail.createdAt ? new Date(detail.createdAt).toLocaleDateString() : '—'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {actionError && (
            <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>
          )}

          {/* Status toggle */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Account status
            </Typography>
            <Button
              variant="outlined"
              size="small"
              color={detail.status === 'ACTIVE' ? 'error' : 'success'}
              disabled={actionBusy}
              onClick={handleStatusToggle}
            >
              {detail.status === 'ACTIVE' ? 'Block user' : 'Unblock user'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Role change */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Role
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {assignableRoles.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                size="small"
                disabled={actionBusy || selectedRole === detail.role}
                onClick={handleRoleChange}
              >
                Apply
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Permissions */}
          <PermissionEditor
            permissions={detail.permissions}
            adminScope={adminScope}
            role={requesterRole}
            userId={userId}
            onSaved={() => {
              getUserDetail(userId).then((res) => {
                if (res.isSuccess()) setDetail(res.getData());
              });
              onUpdate?.();
            }}
          />
        </>
      )}
    </Drawer>
  );
}
