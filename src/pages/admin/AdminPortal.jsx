import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import UsersTab   from '../../components/admin/UsersTab.jsx';
import AssetsTab  from '../../components/admin/AssetsTab.jsx';
import ScopesTab  from '../../components/admin/ScopesTab.jsx';
import ContentTab from '../../components/admin/ContentTab.jsx';

const CHALK_FONT = "'Caveat', cursive";
const ACTIVE_BG  = '#1a5f6e';
const BORDER     = '1.5px solid rgba(255,255,255,0.55)';

export default function AdminPortal() {
  const role = useSelector((s) => s.config.data?.role);
  const [tab, setTab] = useState(0);

  if (!role || (role !== 'ADMIN' && role !== 'SUPERADMIN')) {
    return <Navigate to="/" replace />;
  }

  const isSuperAdmin = role === 'SUPERADMIN';
  const tabs = ['Users', 'Assets', 'Content', ...(isSuperAdmin ? ['Scopes'] : [])];

  return (
    <Box
      sx={{
        m: { xs: 1, md: 2 },
        border: BORDER,
        borderRadius: '14px',
        bgcolor: '#0a0a0a',
        p: { xs: 2, md: 3 },
        minHeight: '82vh',
        fontFamily: CHALK_FONT,
      }}
    >
      {/* Tab row */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        {tabs.map((label, i) => (
          <Box
            key={label}
            component="button"
            onClick={() => setTab(i)}
            sx={{
              fontFamily: CHALK_FONT,
              fontSize: '1.15rem',
              color: '#fff',
              border: BORDER,
              borderRadius: '8px',
              px: 3,
              py: 0.7,
              cursor: 'pointer',
              bgcolor: tab === i ? ACTIVE_BG : 'transparent',
              '&:hover': { bgcolor: tab === i ? ACTIVE_BG : 'rgba(255,255,255,0.07)' },
              transition: 'background 0.15s',
              outline: 'none',
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      {/* Content area */}
      <Box
        sx={{
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '10px',
          p: { xs: 1.5, md: 2.5 },
          minHeight: 420,
        }}
      >
        {tab === 0 && <UsersTab />}
        {tab === 1 && <AssetsTab />}
        {tab === 2 && <ContentTab />}
        {tab === 3 && isSuperAdmin && <ScopesTab />}
      </Box>
    </Box>
  );
}
