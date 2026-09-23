import { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, InputBase, Box,
  Avatar, Menu, MenuItem, Tooltip, useTheme, useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleTheme } from '../../redux/slices/themeSlice.js';
import { logoutUser } from '../../api/authApi.js';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { APP_BAR_HEIGHT, isFocusRoute } from '../../config/layout.js';
import LogoImage from './LogoImage.jsx';

export default function Topbar() {
  const theme     = useTheme();
  const themeMode = useSelector((s) => s.theme);
  const { user, isAuthenticated } = useSelector((s) => s.auth || {});
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { open: drawerOpen, toggle } = useSidebar();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const focusMode = isFocusRoute(location.pathname);

  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: APP_BAR_HEIGHT,
        zIndex: theme.zIndex.drawer + 1,
        left: 0,
        width: '100%',
        bgcolor: theme.palette.background.paper,
        color:   theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        overflow: 'visible',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: `${APP_BAR_HEIGHT}px !important`,
          height: APP_BAR_HEIGHT,
          px: 2,
          position: 'relative',
        }}
      >
        {/* LEFT — toggle + logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
          {!focusMode && location.pathname !== '/login' && (
            <Tooltip title={drawerOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              <IconButton onClick={toggle} size="small">
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <LogoImage size={100} />
        </Box>

        {/* CENTER — search bar, absolutely centred so it stays in the middle regardless of left/right content */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 1,
            px: 1.5, py: 0.5,
            width: 360,
            gap: 1,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <InputBase
            placeholder="Search…"
            sx={{ fontSize: '0.875rem', flex: 1 }}
          />
        </Box>

        {/* RIGHT — theme toggle + login/avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
          <Tooltip title={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton size="small" onClick={() => dispatch(toggleTheme())}>
              {themeMode === 'dark'
                ? <LightModeIcon fontSize="small" sx={{ color: '#faad14' }} />
                : <DarkModeIcon  fontSize="small" />}
            </IconButton>
          </Tooltip>

          {!isAuthenticated && (
            <Box
              component="button"
              onClick={() => navigate('/login')}
              sx={{
                px: 2, py: 0.5,
                bgcolor: 'primary.main',
                color: '#fff',
                border: 'none',
                borderRadius: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              Login
            </Box>
          )}

          {isAuthenticated && (
            <>
              <Tooltip title="Account">
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar
                    src={user?.avatar || undefined}
                    sx={{ width: 30, height: 30, fontSize: '0.75rem' }}
                  >
                    {!user?.avatar && <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{ sx: { mt: 0.5, minWidth: 160 } }}
              >
                <MenuItem onClick={() => { setAnchorEl(null); navigate(`/master/${user?.userId ?? ''}`); }}>Profile</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
                <MenuItem
                  onClick={() => { setAnchorEl(null); logoutUser(); }}
                  sx={{ color: 'error.main' }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
