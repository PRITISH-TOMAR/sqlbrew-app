export const buildOverrides = (theme) => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*': { boxSizing: 'border-box' },
      body: {
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.palette.background.default,
      },
      '::-webkit-scrollbar': { width: 6, height: 6 },
      '::-webkit-scrollbar-thumb': {
        borderRadius: 4,
        backgroundColor: theme.palette.grey[400],
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { fontWeight: 400, borderRadius: 4 },
      contained: {
        '&.Mui-disabled': { backgroundColor: theme.palette.grey[200] },
        '&:hover': { backgroundColor: theme.palette.primary.dark },
      },
      outlined: {
        '&.Mui-disabled': { backgroundColor: theme.palette.grey[200] },
      },
      text: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      input: { padding: '10.5px 14px 10.5px 12px' },
      notchedOutline: {
        borderColor: theme.palette.mode === 'dark'
          ? theme.palette.grey[200]
          : theme.palette.grey[300],
      },
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1,
          borderColor: theme.palette.primary.light,
        },
        '&.Mui-focused': {
          boxShadow: '0 0 0 2px rgba(22,119,255,0.2)',
        },
      },
      inputSizeSmall: { padding: '7.5px 8px 7.5px 12px' },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        padding: 12,
        borderColor: theme.palette.divider,
      },
      head: {
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        backgroundColor: theme.palette.background.paper,
      },
      sizeSmall: { padding: 8 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: 46,
        borderRadius: 4,
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.primary.lighter + '60',
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 4 },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.lighter + '40',
          '&:hover': {
            backgroundColor: theme.palette.primary.lighter + '60',
          },
        },
        '&:hover': {
          backgroundColor: theme.palette.action?.hover
            || (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
        },
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundImage: 'none',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: theme.palette.mode === 'dark'
          ? '0px 1px 4px rgba(0,0,0,0.4)'
          : '0px 1px 4px rgba(38,38,38,0.08)',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: { borderColor: theme.palette.divider },
    },
  },
});
