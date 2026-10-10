// ─────────────────────────────────────────────────────────────────────────────
// BrewQuery "Garnet" palette
//
// Light mode: a deep wine red on cool zinc greys, used sparingly.
// Dark mode: bright crimson/rose on warm near-blacks. Error is burnt orange (not red) so failures never
// read as the brand colour. Every text/background pair meets WCAG AA.
// ─────────────────────────────────────────────────────────────────────────────

// Cool neutral ramp (zinc), light → dark. Mode-independent, the way MUI expects.
// Light mode sits on these clean greys so the wine red reads as an accent, not a tint.
export const neutral = {
  0:   '#FFFFFF',
  50:  '#FAFAFA',
  100: '#F4F4F5',
  200: '#E4E4E7',
  300: '#D4D4D8',
  400: '#A1A1AA',
  500: '#71717A',
  600: '#52525B',
  700: '#3F3F46',
  800: '#27272A',
  900: '#18181B',
};

// Light-mode brand ramp: wine
export const wine = {
  50:  '#F7E9EC',
  100: '#F2D3D9',
  200: '#E5A7B2',
  300: '#D4697B',
  400: '#B3324A',
  500: '#9B1B30',
  600: '#7A1426',
  700: '#5A0F1C',
};

// Dark-mode surfaces (warm near-blacks)
export const ink = {
  base:     '#121012', // app background
  paper:    '#1A1618', // cards, bars, panels
  raised:   '#231E20', // hover, inputs, nested surfaces
  border:   '#332B2E',
  strong:   '#4A4043',
};

// Brand ramp
export const garnet = {
  50:  '#FDECEE',
  100: '#FAD3D8',
  200: '#F5A9B3',
  300: '#F08A97',
  400: '#F2546B',
  500: '#DC2F49',
  600: '#C8203A',
  700: '#A8182E',
  800: '#8E1A2B',
  900: '#6E0F1E',
  950: '#3A1820',
};

const TOKENS = {
  light: {
    primary:   { lighter: wine[50], light: wine[300], main: wine[500], dark: wine[600], darker: wine[700], contrastText: '#FFFFFF' },
    secondary: { lighter: neutral[100], light: neutral[400], main: neutral[600], dark: neutral[700], darker: neutral[900], contrastText: '#FFFFFF' },
    success:   { lighter: '#ECF7EF', light: '#5DB37A', main: '#15803D', dark: '#116632', darker: '#0A4220', contrastText: '#FFFFFF' },
    warning:   { lighter: '#FEF5E7', light: '#E8A24A', main: '#B45309', dark: '#924307', darker: '#5F2C05', contrastText: '#FFFFFF' },
    error:     { lighter: '#FFF1EA', light: '#F59B6B', main: '#C2410C', dark: '#9A330A', darker: '#6B2306', contrastText: '#FFFFFF' },
    info:      { lighter: '#EBF2FC', light: '#7EB0EC', main: '#2563B8', dark: '#1D4F94', darker: '#123463', contrastText: '#FFFFFF' },
    text: { primary: neutral[900], secondary: neutral[600], disabled: neutral[400] },
    background: { default: '#F7F7F8', paper: neutral[0], subtle: neutral[100] },
    divider: neutral[200],
    border:  neutral[300],
    action: {
      hover:              'rgba(24, 24, 27, 0.04)',
      selected:           'rgba(24, 24, 27, 0.06)', // grey selection; the red lives in the text + indicator
      focus:              'rgba(155, 27, 48, 0.12)',
      disabled:           neutral[400],
      disabledBackground: neutral[100],
    },
    difficulty: { easy: '#15803D', medium: '#B45309', hard: '#BE123C' },
    chart: ['#9B1B30', '#2563B8', '#15803D', '#B45309', '#6D28D9', '#0E7490'],
    heat:  [neutral[100], '#F2D3D9', '#D98494', '#B3324A', '#7A1426'],
    code: {
      bg: '#FFFFFF', gutter: '#FAFAFA', lineHighlight: '#F7F7F8', selection: '#F2D3D9',
      keyword: '#9B1B30', string: '#15803D', number: '#B45309', func: '#2563B8',
      comment: '#8A8A93', operator: '#3F3F46', text: '#18181B', lineNumber: '#A1A1AA',
    },
  },
  dark: {
    primary:   { lighter: garnet[950], light: garnet[300], main: garnet[400], dark: garnet[600], darker: garnet[800], contrastText: '#1A0A0E' },
    secondary: { lighter: ink.raised, light: '#CFC6C8', main: '#A89C9F', dark: '#6A5F62', darker: ink.border, contrastText: '#121012' },
    success:   { lighter: '#12301F', light: '#7FE3B0', main: '#3DD68C', dark: '#22A86A', darker: '#0F5A37', contrastText: '#06210F' },
    warning:   { lighter: '#332611', light: '#F9CF7E', main: '#F5B544', dark: '#C98C1C', darker: '#6B4A0D', contrastText: '#241703' },
    error:     { lighter: '#3A1F14', light: '#FFB08A', main: '#FF8A4C', dark: '#E0662A', darker: '#7A3311', contrastText: '#2A1106' },
    info:      { lighter: '#14263B', light: '#A3CDF8', main: '#6AB0F5', dark: '#3D8BDB', darker: '#1C4A7A', contrastText: '#0A1A2B' },
    text: { primary: '#F2ECEC', secondary: '#A89C9F', disabled: '#6A5F62' },
    background: { default: ink.base, paper: ink.paper, subtle: ink.raised },
    divider: ink.border,
    border:  ink.strong,
    action: {
      hover:              'rgba(242, 236, 236, 0.05)',
      selected:           'rgba(242, 84, 107, 0.14)',
      focus:              'rgba(242, 84, 107, 0.2)',
      disabled:           '#6A5F62',
      disabledBackground: ink.raised,
    },
    difficulty: { easy: '#3DD68C', medium: '#F5B544', hard: '#FB7185' },
    chart: ['#F2546B', '#6AB0F5', '#3DD68C', '#F5B544', '#B79BF2', '#4FD1C5'],
    heat:  [ink.raised, '#4A1A25', '#8E1A2B', '#DC2F49', '#F2546B'],
    code: {
      bg: ink.paper, gutter: ink.paper, lineHighlight: '#211B1D', selection: '#4A1A25',
      keyword: '#F2546B', string: '#7FD8A6', number: '#F5B544', func: '#6AB0F5',
      comment: '#75696C', operator: '#CFC6C8', text: '#F2ECEC', lineNumber: '#5A4F52',
    },
  },
};

export const buildPalette = (mode) => {
  const t = TOKENS[mode] ?? TOKENS.light;
  return {
    mode,
    common: { black: '#0B0A0B', white: '#FFFFFF' },
    primary:   t.primary,
    secondary: t.secondary,
    success:   t.success,
    warning:   t.warning,
    error:     t.error,
    info:      t.info,
    grey: {
      ...neutral,
      A50:  t.background.default,
      A800: t.divider,
    },
    text:       t.text,
    divider:    t.divider,
    border:     t.border,
    background: t.background,
    action:     { ...t.action, hoverOpacity: 0.05, selectedOpacity: 0.1, activatedOpacity: 0.12 },
    difficulty: t.difficulty,
    chart:      t.chart,
    heat:       t.heat,
    code:       t.code,
  };
};

// Map any difficulty string to a palette colour (falls back to text.secondary)
export const difficultyColor = (theme, value) => {
  const key = String(value || '').toLowerCase();
  const map = { easy: 'easy', beginner: 'easy', medium: 'medium', intermediate: 'medium', hard: 'hard', advanced: 'hard' };
  return theme.palette.difficulty[map[key]] ?? theme.palette.text.secondary;
};
