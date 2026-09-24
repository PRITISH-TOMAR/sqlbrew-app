import { useEffect, useState } from 'react';
import {
  Box, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Chip, Typography, CircularProgress,
  Alert, TextField, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { listUsers } from '../../api/adminApi.js';
import UserDetailDrawer from './UserDetailDrawer.jsx';

const ROLE_COLOR = { SUPERADMIN: 'error', ADMIN: 'warning', USER: 'default' };
const STATUS_COLOR = { ACTIVE: 'success', BLOCKED: 'error' };

export default function UsersTab() {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [selectedId,  setSelectedId]  = useState(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    listUsers().then((res) => {
      setLoading(false);
      if (res.isSuccess()) setUsers(res.getData() ?? []);
      else setError(res.message);
    });
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const handleRowClick = (userId) => {
    setSelectedId(userId);
    setDrawerOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="600">
          {loading ? 'Loading...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
        </Typography>
        <TextField
          size="small"
          placeholder="Search by name, email, role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Joined</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" py={3}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow
                    key={u.userId}
                    hover
                    onClick={() => handleRowClick(u.userId)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" color={ROLE_COLOR[u.role] ?? 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip label={u.status} size="small" color={STATUS_COLOR[u.status] ?? 'default'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserDetailDrawer
        open={drawerOpen}
        userId={selectedId}
        onClose={() => setDrawerOpen(false)}
        onUpdate={load}
      />
    </Box>
  );
}
