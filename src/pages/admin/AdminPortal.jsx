import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useSelector } from 'react-redux';
import UsersTab   from '../../components/admin/UsersTab.jsx';
import AssetsTab  from '../../components/admin/AssetsTab.jsx';
import ScopesTab  from '../../components/admin/ScopesTab.jsx';
import ContentTab from '../../components/admin/ContentTab.jsx';

export default function AdminPortal() {
  const role = useSelector((s) => s.config.data?.role);
  const [tab, setTab] = useState(0);

  if (!role || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return <Navigate to="/" replace />;
  }

  const isSuperAdmin = role === 'SUPERADMIN';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" fontWeight="bold" lineHeight={1.2}>
            Admin Portal
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isSuperAdmin ? 'Super Admin' : 'Admin'} view
          </Typography>
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Users" />
        <Tab label="Assets" />
        <Tab label="Content" />
        {isSuperAdmin && <Tab label="Scopes" />}
      </Tabs>

      {tab === 0 && <UsersTab />}
      {tab === 1 && <AssetsTab />}
      {tab === 2 && <ContentTab />}
      {tab === 3 && isSuperAdmin && <ScopesTab />}
    </Box>
  );
}
