import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Chip, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import UsersIcon from '@mui/icons-material/GroupOutlined';
import AssetsIcon from '@mui/icons-material/PermMediaOutlined';
import ContentIcon from '@mui/icons-material/LibraryBooksOutlined';
import ScopesIcon from '@mui/icons-material/VpnKeyOutlined';
import { useSelector } from 'react-redux';
import UsersTab   from '../../components/admin/UsersTab.jsx';
import AssetsTab  from '../../components/admin/AssetsTab.jsx';
import ScopesTab  from '../../components/admin/ScopesTab.jsx';
import ContentTab from '../../components/admin/ContentTab.jsx';

const TABS = [
  { label: 'Users',   icon: <UsersIcon />,   description: 'Accounts, roles and access' },
  { label: 'Assets',  icon: <AssetsIcon />,  description: 'Images and uploaded files' },
  { label: 'Content', icon: <ContentIcon />, description: 'Datasets, questions, solutions and test cases' },
  { label: 'Scopes',  icon: <ScopesIcon />,  description: 'Permission scopes', superAdminOnly: true },
];

export default function AdminPortal() {
  const role = useSelector((s) => s.config.data?.role);
  const [tab, setTab] = useState(0);

  if (!role || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return <Navigate to="/" replace />;
  }

  const isSuperAdmin = role === 'SUPERADMIN';
  const tabs = TABS.filter((t) => !t.superAdminOnly || isSuperAdmin);
  const current = tabs[tab] ?? tabs[0];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 0.5 }}>
        <Typography variant="h2" component="h1">Admin portal</Typography>
        <Chip size="small" color="primary" label={isSuperAdmin ? 'Super admin' : 'Admin'} />
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
        {current.description}
      </Typography>

      <Paper
        variant="outlined"
        sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper', minHeight: '70vh' }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          {tabs.map((t) => (
            <Tab key={t.label} label={t.label} icon={t.icon} iconPosition="start" sx={{ gap: 0.5, '& .MuiTab-icon': { fontSize: 18, mr: 0.5 } }} />
          ))}
        </Tabs>

        <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
          {current.label === 'Users'   && <UsersTab />}
          {current.label === 'Assets'  && <AssetsTab />}
          {current.label === 'Content' && <ContentTab />}
          {current.label === 'Scopes'  && isSuperAdmin && <ScopesTab />}
        </Box>
      </Paper>
    </Box>
  );
}
