import { useEffect, useMemo } from 'react';
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
      shape: { borderRadius: 6 },
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

  // Keep the browser chrome (mobile address bar, PWA title bar) in step with the theme
  useEffect(() => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme.palette.background.paper);
    // index.html paints <html> before React loads; keep it in sync when the theme is toggled
    document.documentElement.style.background = theme.palette.background.default;
    document.documentElement.style.colorScheme = themeMode;
  }, [theme, themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
