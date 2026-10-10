import { useEffect, useRef, useState } from 'react';
import {
  AppBar, Toolbar, IconButton, InputBase, Box, Button, Divider,
  Avatar, Menu, MenuItem, ListItemIcon, Tooltip, Typography, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/MenuRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlineRounded';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toggleTheme } from '../../redux/slices/themeSlice.js';
import { logoutUser } from '../../api/authApi.js';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { APP_BAR_HEIGHT, isFocusRoute } from '../../config/layout.js';
import LogoImage from './LogoImage.jsx';

const initialsOf = (user) => {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.email || '';
  return name.split(/[\s@]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join('');
};

export default function Topbar() {
  const theme     = useTheme();
  const themeMode = useSelector((s) => s.theme);
  const { user, isAuthenticated } = useSelector((s) => s.auth || {});
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { open: drawerOpen, toggle } = useSidebar();
  const focusMode = isFocusRoute(location.pathname);

  const [anchorEl, setAnchorEl] = useState(null);
  const searchRef = useRef(null);

  // "/" focuses search unless the user is already typing somewhere
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement;
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (typing || !searchRef.current) return;
      e.preventDefault();
      searchRef.current.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name;
  const initials    = initialsOf(user);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: APP_BAR_HEIGHT,
        zIndex: theme.zIndex.drawer + 1,
        left: 0,
        width: '100%',
        bgcolor: 'background.paper',
        color: 'text.primary',
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
          px: { xs: 1.5, sm: 2 },
          position: 'relative',
          gap: 1,
        }}
      >
        {/* LEFT — toggle + logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          {isAuthenticated && !focusMode && location.pathname !== '/login' && (
            <Tooltip title={drawerOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
              <IconButton onClick={toggle} size="small" aria-label="Toggle sidebar">
                <MenuIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <LogoImage size={28} />
        </Box>

        {/* CENTER — search, absolutely centred so it stays put regardless of side content */}
        <Box
          component="label"
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: 'background.subtle',
            borderRadius: 2,
            px: 1.25,
            height: 34,
            width: 380,
            gap: 1,
            border: '1px solid transparent',
            cursor: 'text',
            transition: 'border-color .15s, box-shadow .15s, background-color .15s',
            '&:hover': { borderColor: 'divider' },
            '&:focus-within': {
              bgcolor: 'background.paper',
              borderColor: 'primary.main',
              boxShadow: theme.customShadows.primary,
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <InputBase
            placeholder="Search datasets and problems"
            inputRef={searchRef}
            inputProps={{ 'aria-label': 'Search' }}
            sx={{ fontSize: '0.8125rem', flex: 1 }}
          />
          <Box
            component="kbd"
            sx={{
              fontFamily: 'inherit', fontSize: '0.6875rem', fontWeight: 600,
              color: 'text.secondary', border: '1px solid', borderColor: 'divider',
              borderRadius: 1, px: 0.75, py: 0.125, lineHeight: 1.6, bgcolor: 'background.paper',
            }}
          >
            /
          </Box>
        </Box>

        {/* RIGHT — theme toggle + login/avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
          <Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton size="small" onClick={() => dispatch(toggleTheme())} aria-label="Toggle colour theme">
              {themeMode === 'dark'
                ? <LightModeIcon fontSize="small" sx={{ color: 'warning.main' }} />
                : <DarkModeIcon  fontSize="small" />}
            </IconButton>
          </Tooltip>

          {!isAuthenticated && location.pathname !== '/login' && (
            <Button variant="contained" size="small" onClick={() => navigate('/login')} sx={{ px: 2 }}>
              Sign in
            </Button>
          )}

          {isAuthenticated && (
            <>
              <Tooltip title="Account">
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  aria-label="Open account menu"
                  sx={{ p: 0.25, borderRadius: '50%' }}
                >
                  <Avatar
                    src={user?.avatar || undefined}
                    sx={{
                      width: 32, height: 32, fontSize: '0.75rem',
                      border: '2px solid', borderColor: Boolean(anchorEl) ? 'primary.main' : 'transparent',
                      transition: 'border-color .15s',
                    }}
                  >
                    {!user?.avatar && (initials || <PersonIcon fontSize="small" />)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
              >
                {(displayName || user?.email) && (
                  <Box sx={{ px: 1.5, pt: 1, pb: 1.25 }}>
                    {displayName && <Typography variant="subtitle2" noWrap>{displayName}</Typography>}
                    {user?.email && <Typography variant="caption" color="text.secondary" noWrap component="div">{user.email}</Typography>}
                  </Box>
                )}
                {(displayName || user?.email) && <Divider sx={{ my: 0.5 }} />}
                <MenuItem onClick={() => { setAnchorEl(null); navigate(`/master/${user?.userId ?? ''}`); }}>
                  <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                  <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                  Settings
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => { setAnchorEl(null); logoutUser(); }}
                  sx={{ color: 'error.main', '& .MuiListItemIcon-root': { color: 'error.main' } }}
                >
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
