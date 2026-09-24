import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Topbar             from './Topbar.jsx';
import Sidebar            from './Sidebar.jsx';
import ApiErrorBanner     from './ApiErrorBanner.jsx';
import ConfigFailedScreen from './ConfigFailedScreen.jsx';
import Routing            from '../../Routing.jsx';
import { fetchUserConfig }    from '../../api/configApi.js';
import { MAX_CONFIG_RETRIES } from '../../redux/slices/configSlice.js';
import { APP_BAR_HEIGHT, isFocusRoute } from '../../config/layout.js';

export default function Layout() {
  const user             = useSelector((s) => s.auth.user);
  const isAuthenticated  = useSelector((s) => s.auth.isAuthenticated);
  const configLoaded     = useSelector((s) => s.config.loaded);
  const configLoading    = useSelector((s) => s.config.loading);
  const configRetryCount = useSelector((s) => s.config.retryCount);
  const location         = useLocation();
  const focusMode        = isFocusRoute(location.pathname);

  useEffect(() => {
    if (isAuthenticated && !configLoaded && !configLoading && configRetryCount < MAX_CONFIG_RETRIES) {
      fetchUserConfig();
    }
  }, [isAuthenticated, configLoaded, configLoading, configRetryCount]);

  // All retries exhausted — show error screen
  if (isAuthenticated && !configLoaded && configRetryCount >= MAX_CONFIG_RETRIES) {
    return <ConfigFailedScreen />;
  }

  // Config not yet resolved — render nothing until it's ready
  if (isAuthenticated && !configLoaded) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        ...(focusMode ? { height: '100vh', overflow: 'hidden' } : { minHeight: '100vh' }),
      }}
    >
      <Topbar />

      {user && !focusMode && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: `${APP_BAR_HEIGHT}px`,
          minWidth: 0,
          ...(focusMode ? { height: '100vh', overflow: 'hidden' } : { minHeight: '100vh' }),
        }}
      >
        <Routing />
      </Box>

      <ApiErrorBanner />
    </Box>
  );
}
