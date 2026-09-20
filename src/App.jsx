import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { MuiThemeProvider } from './theme/index.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';

import Topbar  from './components/global/Topbar.jsx';
import Sidebar from './components/global/Sidebar.jsx';
import Routing from './Routing.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';

import { APP_BAR_HEIGHT, isFocusRoute } from './config/layout.js';

function Layout() {
  const user = useSelector((s) => s.auth.user);
  const location = useLocation();
  const focusMode = isFocusRoute(location.pathname);

  return (
    /*
     * Flex row: Sidebar (permanent, takes up its width in flow) + main content.
     * AppBar is fixed and offset leftward by the sidebar width via its own sx.
     * Main content just needs pt to clear the fixed AppBar.
     * Focus routes (e.g. the problem solver) drop the sidebar entirely for
     * a distraction-free, full-width workspace.
     */
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        // Focus routes (the split-pane problem solver) are a fixed-height app
        // shell: the page itself never scrolls, only its internal panes do.
        // Everything else scrolls normally with the page.
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
          minWidth: 0, // prevent flex child overflow
          ...(focusMode ? { height: '100vh', overflow: 'hidden' } : { minHeight: '100vh' }),
        }}
      >
        <Routing />
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <MuiThemeProvider>
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/credentials/:resetKey" element={<ResetPassword />} />
            <Route path="*" element={<Layout />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}
