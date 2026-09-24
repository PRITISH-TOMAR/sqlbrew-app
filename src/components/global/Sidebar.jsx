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

  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;

  const isSelected = hasChildren
    ? item.children.some((c) => pathname.startsWith(c.path))
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

  const button = (
    <ListItemButton
      selected={isSelected && !hasChildren}
      onClick={handleClick}
      sx={{
        minHeight: 56,
        px: drawerOpen ? 3 : 1.5,
        py: 1,
        gap: 0.5,
        mx: 0.5,
        borderRadius: 1,
        justifyContent: drawerOpen ? 'initial' : 'center',
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 32,
          justifyContent: 'center',
          fontSize: 20,
          color: isSelected ? 'primary.main' : 'text.primary',
        }}
      >
        {item.icon}
      </ListItemIcon>

      {drawerOpen && (
        <>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              variant: 'h6',
              noWrap: true,
              sx: { color: isSelected ? 'primary.main' : 'text.primary' },
            }}
          />
          {hasChildren && (
            expanded
              ? <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} />
              : <ExpandMore  sx={{ fontSize: 18, color: 'text.secondary' }} />
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
          <List disablePadding>
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
                  sx={{ minHeight: 44, pl: 6, pr: 3, py: 0.75, borderRadius: 1, mx: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 28, fontSize: 16, color: childSelected ? 'primary.main' : 'inherit' }}>
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.label}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
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

  // Build Dashboard children from config — locked modules get a lock icon
  const dashboardChildren = MODULE_ITEMS.map((m) => {
    const configEntry = configModules?.find((c) => c.key === m.moduleKey);
    const enabled = configEntry?.enabled ?? false;
    return {
      ...m,
      locked: !enabled,
      icon: enabled ? m.icon : <LockIcon sx={{ fontSize: 18 }} />,
    };
  });

  const navItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      children: dashboardChildren,
    },
    ...STATIC_NAV_ITEMS,
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', pb: 2 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', mt: 0.5 }}>
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
    borderRight: open ? `1px solid ${theme.palette.divider}` : 'none',
    boxShadow: open
      ? 'none'
      : '2px 0 8px rgba(0,0,0,0.06)',
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
