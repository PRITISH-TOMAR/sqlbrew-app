import { useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { buildPalette } from './palette';
import { typography } from './typography';
import { buildShadows } from './shadows';
import { buildOverrides } from './overrides';

export function MuiThemeProvider({ children }) {
  const themeMode = useSelector((s) => s.theme); // 'light' | 'dark'

  const theme = useMemo(() => {
    const palette = buildPalette(themeMode);
    const shadows = buildShadows(themeMode);

    const base = createTheme({
      palette,
      typography,
      customShadows: shadows,
      breakpoints: {
        values: { xs: 0, sm: 768, md: 1024, lg: 1266, xl: 1536 },
      },
      mixins: {
        toolbar: { minHeight: 48, paddingTop: 0, paddingBottom: 0 },
      },
    });

    base.components = buildOverrides(base);
    return base;
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
