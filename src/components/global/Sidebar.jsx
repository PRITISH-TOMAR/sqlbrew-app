import {
  Drawer, Box, List, ListItemButton, ListItemIcon,
  ListItemText, Tooltip, Typography, Collapse,
  useTheme, useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import StorageIcon from '@mui/icons-material/StorageOutlined';
import NoSQLIcon from '@mui/icons-material/AccountTreeOutlined';
import VectorIcon from '@mui/icons-material/BlurOnOutlined';
import ProgressIcon from '@mui/icons-material/TrendingUpOutlined';
import ContestsIcon from '@mui/icons-material/EmojiEventsOutlined';
import ResourcesIcon from '@mui/icons-material/MenuBookOutlined';
import AdminIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { APP_BAR_HEIGHT, DRAWER_WIDTH, ICON_DRAWER_WIDTH } from '../../config/layout.js';

// moduleKey matches what the backend returns (SQL | NOSQL | VECTORDB)
const MODULE_ITEMS = [
  { label: 'SQL',             icon: <StorageIcon />, path: '/sql',      moduleKey: 'SQL'      },
  { label: 'NoSQL',           icon: <NoSQLIcon />,   path: '/nosql',    moduleKey: 'NOSQL'    },
  { label: 'Vector Database', icon: <VectorIcon />,  path: '/vectordb', moduleKey: 'VECTORDB' },
];

const STATIC_NAV_ITEMS = [
  {
    label: 'Resources',
    icon: <ResourcesIcon />,
    path: '/resources',
    children: [
      { label: 'Redis', icon: <StorageIcon />,   path: '/redis' },
      { label: 'Guide', icon: <ResourcesIcon />, path: '/guide' },
    ],
  },
  { label: 'Progress', icon: <ProgressIcon />, path: '/progress' },
  { label: 'Contests', icon: <ContestsIcon />, path: '/contests' },
];

function NavItem({ item, drawerOpen }) {
  const theme    = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { close }    = useSidebar();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const hasChildren = !!item.children?.length;
  const childActive = hasChildren && item.children.some((c) => !c.locked && pathname.startsWith(c.path));
  const [expanded, setExpanded] = useState(childActive || item.defaultExpanded || false);

  const isSelected = hasChildren
    ? childActive
    : item.path === '/'
      ? pathname === '/'
      : pathname.startsWith(item.path) || (pathname.startsWith('/master') && item.label === 'Profile');

  const handleClick = () => {
    if (hasChildren) {
      if (drawerOpen) setExpanded((v) => !v);
    } else {
      navigate(item.path);
      if (!isLg) close();
    }
  };

  const accent = theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main';

  const button = (
    <ListItemButton
      selected={isSelected && !hasChildren}
      onClick={handleClick}
      aria-expanded={hasChildren ? expanded : undefined}
      sx={{
        position: 'relative',
        minHeight: 40,
        px: drawerOpen ? 1.5 : 0,
        py: 0.75,
        gap: 1.25,
        mx: 1,
        mb: 0.25,
        justifyContent: drawerOpen ? 'initial' : 'center',
        color: isSelected ? accent : 'text.secondary',
        '&:hover': { color: 'text.primary' },
        '&.Mui-selected::before': {
          content: '""', position: 'absolute', left: -8, top: 8, bottom: 8,
          width: 3, borderRadius: '0 3px 3px 0', bgcolor: 'primary.main',
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          justifyContent: 'center',
          color: 'inherit',
          '& svg': { fontSize: 20 },
        }}
      >
        {item.icon}
      </ListItemIcon>

      {drawerOpen && (
        <>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              noWrap: true,
              sx: { fontSize: '0.875rem', fontWeight: isSelected ? 700 : 500, color: 'inherit' },
            }}
          />
          {hasChildren && (
            expanded
              ? <ExpandLess sx={{ fontSize: 18, color: 'text.disabled' }} />
              : <ExpandMore  sx={{ fontSize: 18, color: 'text.disabled' }} />
          )}
        </>
      )}
    </ListItemButton>
  );

  return (
    <>
      {drawerOpen
        ? button
        : <Tooltip title={item.label} placement="right" arrow>{button}</Tooltip>}

      {hasChildren && drawerOpen && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding sx={{ position: 'relative', '&::before': { content: '""', position: 'absolute', left: 29.5, top: 2, bottom: 6, width: '1px', bgcolor: 'divider' } }}>
            {item.children.map((child) => {
              const childSelected = !child.locked && (child.path === '/'
                ? pathname === '/'
                : pathname.startsWith(child.path));
              return (
                <ListItemButton
                  key={child.path}
                  selected={childSelected}
                  disabled={child.locked}
                  onClick={() => {
                    if (child.locked) return;
                    navigate(child.path);
                    if (!isLg) close();
                  }}
                  sx={{
                    minHeight: 34, pl: 2, pr: 1.5, py: 0.5, mr: 1, ml: 4.5, mb: 0.25,
                    color: childSelected ? accent : 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                    '&.Mui-disabled': { opacity: 0.55 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 26, color: 'inherit', '& svg': { fontSize: 17 } }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{ noWrap: true, sx: { fontSize: '0.8125rem', fontWeight: childSelected ? 700 : 500, color: 'inherit' } }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </>
  );
}

function DrawerContent({ open }) {
  const configModules = useSelector((s) => s.config.data?.modules);
  const role          = useSelector((s) => s.config.data?.role);
  const isAdmin       = role === 'ADMIN' || role === 'SUPERADMIN';

  // Build Dashboard children from config — locked modules get a lock icon
  const dashboardChildren = MODULE_ITEMS.map((m) => {
    const configEntry = configModules?.find((c) => c.key === m.moduleKey);
    const enabled = configEntry?.enabled ?? false;
    return {
      ...m,
      locked: !enabled,
      icon: enabled ? m.icon : <LockIcon />,
    };
  });

  const navItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      children: dashboardChildren,
      defaultExpanded: true,
    },
    ...STATIC_NAV_ITEMS,
    ...(isAdmin ? [{ label: 'Admin Portal', icon: <AdminIcon />, path: '/admin' }] : []),
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', pb: 2 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', pt: 1.5 }}>
        <List disablePadding>
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} drawerOpen={open} />
          ))}
        </List>
      </Box>
    </Box>
  );
}

export default function Sidebar() {
  const theme = useTheme();
  const { open, toggle, close } = useSidebar();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  /* Shared paper styles — drawer is full-height (top:0), no mt */
  const paperSx = {
    width: open ? DRAWER_WIDTH : ICON_DRAWER_WIDTH,
    overflowX: 'hidden',
    border: 'none',
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    top: APP_BAR_HEIGHT,
    height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
    transition: theme.transitions.create('width', {
      easing:   theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
  };

  /* Desktop — permanent mini-drawer that participates in flex layout */
  if (isLg) {
    return (
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          width: open ? DRAWER_WIDTH : ICON_DRAWER_WIDTH,
          transition: theme.transitions.create('width', {
            easing:   theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          '& .MuiDrawer-paper': paperSx,
        }}
      >
        <DrawerContent open={open} />
      </Drawer>
    );
  }

  /* Mobile — temporary overlay */
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={close}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          ...paperSx,
          width: DRAWER_WIDTH,
        },
      }}
    >
      <DrawerContent open />
    </Drawer>
  );
}
