import { alpha } from '@mui/material/styles';

export const buildOverrides = (theme) => {
  const { palette } = theme;
  const isDark  = palette.mode === 'dark';
  const ring    = `0 0 0 3px ${alpha(palette.primary.main, isDark ? 0.35 : 0.22)}`;
  const radius  = { sm: 6, md: 8, lg: 12 };

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          scrollbarColor: `${palette.border} transparent`,
          scrollbarWidth: 'thin',
        },
        html: { colorScheme: palette.mode },
        body: {
          fontFamily: theme.typography.fontFamily,
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: alpha(palette.primary.main, isDark ? 0.4 : 0.2),
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: 8,
          backgroundColor: palette.border,
          border: `2px solid ${palette.background.default}`,
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: palette.text.disabled },
        'code, kbd, pre, samp': { fontFamily: theme.typography.fontFamilyMono },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },

    // ── Surfaces ────────────────────────────────────────────────────────────
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: radius.lg },
        outlined: { borderColor: palette.divider },
        elevation1: { boxShadow: theme.customShadows.card },
        elevation8: { boxShadow: theme.customShadows.popover },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid ${palette.divider}`,
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none', backgroundColor: palette.background.paper },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: palette.background.paper,
          boxShadow: 'none',
          borderBottom: `1px solid ${palette.divider}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: palette.divider } },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(isDark ? '#000000' : palette.grey[900], isDark ? 0.6 : 0.35),
          '&.MuiBackdrop-invisible': { backgroundColor: 'transparent' },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg + 2,
          border: `1px solid ${palette.divider}`,
          boxShadow: theme.customShadows.dialog,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontSize: '1.0625rem', fontWeight: 700, padding: '20px 24px 12px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '12px 24px 20px', gap: 8 } },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: radius.md + 2,
          border: `1px solid ${palette.divider}`,
          boxShadow: theme.customShadows.popover,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius.md + 2,
          border: `1px solid ${palette.divider}`,
          boxShadow: theme.customShadows.popover,
        },
        list: { padding: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontSize: '0.875rem',
          minHeight: 36,
          '&.Mui-selected': {
            backgroundColor: palette.action.selected,
            color: palette.primary.main,
            fontWeight: 600,
            '&:hover': { backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.12) },
          },
          '&.Mui-focusVisible': { backgroundColor: palette.action.focus },
        },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          backgroundColor: isDark ? palette.grey[100] : palette.grey[900],
          color: isDark ? palette.grey[900] : palette.grey[50],
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 10px',
          borderRadius: radius.sm,
        },
        arrow: { color: isDark ? palette.grey[100] : palette.grey[900] },
      },
    },

    // ── Buttons ─────────────────────────────────────────────────────────────
    MuiButtonBase: {
      defaultProps: { disableRipple: false },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: radius.md,
          textTransform: 'none',
          letterSpacing: 0,
          transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], { duration: 150 }),
          '&.Mui-focusVisible': { boxShadow: ring },
        },
        sizeSmall: { padding: '5px 12px', fontSize: '0.8125rem' },
        sizeMedium: { padding: '7px 16px' },
        sizeLarge: { padding: '10px 22px', fontSize: '0.9375rem' },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: palette.action.disabledBackground,
            color: palette.text.disabled,
          },
        },
        containedPrimary: {
          boxShadow: isDark ? 'none' : `0 1px 2px ${alpha(palette.primary.darker, 0.25)}, inset 0 1px 0 ${alpha('#FFFFFF', 0.12)}`,
          '&:hover': { backgroundColor: palette.primary.dark, color: '#FFFFFF' },
        },
        outlined: {
          borderColor: palette.border,
          '&:hover': { borderColor: palette.text.disabled, backgroundColor: palette.action.hover },
          '&.Mui-disabled': { borderColor: palette.divider },
        },
        outlinedPrimary: {
          borderColor: alpha(palette.primary.main, 0.5),
          '&:hover': { borderColor: palette.primary.main, backgroundColor: alpha(palette.primary.main, 0.06) },
        },
        outlinedInherit: { borderColor: palette.border },
        text: { '&:hover': { backgroundColor: palette.action.hover } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          color: palette.text.secondary,
          '&:hover': { backgroundColor: palette.action.hover, color: palette.text.primary },
          '&.Mui-focusVisible': { boxShadow: ring },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.subtle,
          borderRadius: radius.md,
          padding: 2,
          gap: 2,
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: `${radius.sm}px !important`,
            margin: 0,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: palette.text.secondary,
          '&:hover': { backgroundColor: palette.action.hover },
          '&.Mui-selected': {
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            boxShadow: theme.customShadows.z1,
            '&:hover': { backgroundColor: palette.background.paper },
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: { root: { boxShadow: theme.customShadows.popover } },
    },

    // ── Inputs ──────────────────────────────────────────────────────────────
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
        input: {
          '&::placeholder': { color: palette.text.disabled, opacity: 1 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          backgroundColor: palette.background.paper,
          transition: theme.transitions.create(['box-shadow', 'border-color'], { duration: 150 }),
          '&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.text.disabled,
          },
          '&.Mui-focused': { boxShadow: ring },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: palette.primary.main,
          },
          '&.Mui-error.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(palette.error.main, 0.22)}` },
          '&.Mui-disabled': { backgroundColor: palette.background.subtle },
        },
        notchedOutline: { borderColor: palette.border },
        input: { padding: '10.5px 14px 10.5px 12px' },
        inputSizeSmall: { padding: '8.5px 10px 8.5px 12px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: palette.text.secondary,
          '&.Mui-focused': { color: palette.primary.main },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 2, fontSize: '0.75rem' } },
    },
    MuiSelect: {
      styleOverrides: { icon: { color: palette.text.secondary } },
    },
    MuiCheckbox: {
      defaultProps: { color: 'primary' },
      styleOverrides: { root: { color: palette.border, borderRadius: radius.sm } },
    },
    MuiRadio: {
      styleOverrides: { root: { color: palette.border } },
    },
    MuiSwitch: {
      styleOverrides: {
        root: { padding: 8 },
        track: {
          borderRadius: 12,
          backgroundColor: palette.border,
          opacity: 1,
        },
        thumb: { boxShadow: 'none', width: 16, height: 16, margin: 2 },
        switchBase: {
          '&.Mui-checked + .MuiSwitch-track': { opacity: 1 },
          '&.Mui-checked .MuiSwitch-thumb': { color: palette.primary.contrastText },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: radius.md + 2, border: `1px solid ${palette.divider}`, boxShadow: theme.customShadows.popover },
        listbox: { padding: 4, '& .MuiAutocomplete-option': { borderRadius: radius.sm, fontSize: '0.875rem' } },
      },
    },

    // ── Data display ────────────────────────────────────────────────────────
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: radius.md } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '12px 16px',
          borderColor: palette.divider,
        },
        head: {
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: palette.text.secondary,
          backgroundColor: palette.background.subtle,
        },
        stickyHeader: { backgroundColor: palette.background.subtle },
        sizeSmall: { padding: '8px 12px' },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': { backgroundColor: palette.action.hover },
          '&.Mui-selected': { backgroundColor: palette.action.selected },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: radius.sm, fontWeight: 600 },
        sizeSmall: { height: 24, fontSize: '0.75rem' },
        label: { paddingLeft: 10, paddingRight: 10 },
        labelSmall: { paddingLeft: 8, paddingRight: 8 },
        outlined: { borderColor: palette.border },
        filled: {
          '&.MuiChip-colorDefault': { backgroundColor: palette.background.subtle, color: palette.text.secondary },
        },
        // Soft-tinted semantic chips instead of saturated fills
        colorSuccess: softChip(palette.success, isDark),
        colorWarning: softChip(palette.warning, isDark),
        colorError:   softChip(palette.error, isDark),
        colorInfo:    softChip(palette.info, isDark),
        colorPrimary: softChip(palette.primary, isDark),
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: palette.primary.lighter,
          color: palette.mode === 'dark' ? palette.primary.light : palette.primary.dark,
          fontWeight: 700,
        },
      },
    },
    MuiBadge: {
      styleOverrides: { badge: { fontWeight: 700 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: palette.background.subtle },
        bar: { borderRadius: 8 },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: isDark ? alpha('#FFFFFF', 0.06) : alpha(palette.grey[900], 0.06) },
        rounded: { borderRadius: radius.md },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius.md, alignItems: 'center' },
        standardSuccess: { backgroundColor: palette.success.lighter, color: palette.success.main },
        standardWarning: { backgroundColor: palette.warning.lighter, color: palette.warning.main },
        standardError:   { backgroundColor: palette.error.lighter,   color: palette.error.main },
        standardInfo:    { backgroundColor: palette.info.lighter,    color: palette.info.main },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: isDark ? palette.primary.light : palette.primary.main,
          '&:hover': { color: isDark ? palette.primary.light : palette.primary.dark },
        },
      },
    },

    // ── Navigation ──────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 2, borderRadius: 2, backgroundColor: palette.primary.main },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          color: palette.text.secondary,
          '&:hover': { color: palette.text.primary },
          '&.Mui-selected': { color: palette.text.primary },
          '&.Mui-focusVisible': { backgroundColor: palette.action.focus },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          '&:hover': { backgroundColor: palette.action.hover },
          '&.Mui-selected': {
            color: isDark ? palette.primary.light : palette.primary.main,
            backgroundColor: palette.action.selected,
            '&:hover': { backgroundColor: alpha(palette.primary.main, isDark ? 0.2 : 0.12) },
          },
          '&.Mui-focusVisible': { backgroundColor: palette.action.focus },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { color: 'inherit' } },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          fontWeight: 600,
          '&.Mui-selected': {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            borderColor: palette.primary.main,
            '&:hover': { backgroundColor: palette.primary.dark, color: '#FFFFFF' },
          },
        },
        outlined: { borderColor: palette.border },
      },
    },
  };
};

function softChip(color, isDark) {
  return {
    backgroundColor: color.lighter,
    color: isDark ? color.main : color.dark,
    '&.MuiChip-outlined': {
      backgroundColor: 'transparent',
      borderColor: alpha(color.main, 0.45),
      color: isDark ? color.main : color.dark,
    },
    '& .MuiChip-icon': { color: 'inherit' },
    '& .MuiChip-deleteIcon': { color: alpha(color.main, 0.6), '&:hover': { color: color.main } },
  };
}
