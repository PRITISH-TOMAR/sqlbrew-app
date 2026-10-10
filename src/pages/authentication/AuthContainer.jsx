import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Stack, Typography, useTheme } from '@mui/material';
import Login  from '../../components/auth/Login.jsx';
import Signup from '../../components/auth/Signup.jsx';
import singupDark  from '../../assets/images/signup-dark.jpg';
import signupLight from '../../assets/images/signup-light.jpg';
import { APP_BAR_HEIGHT } from '../../config/layout.js';

export default function AuthContainer() {
  const themeMode = useSelector((s) => s.theme);
  const theme     = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Box
      sx={{
        display: 'flex',
        // Must be `height`, not `minHeight`: a min-height still leaves the used
        // height "auto" (content-based) per spec, so a descendant's
        // height:'100%' can't resolve against it and falls back to the
        // <img>'s intrinsic aspect ratio instead of filling its container.
        // `height` makes this box (and everything under it) a definite size,
        // independent of the app shell above only setting minHeight.
        height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
        bgcolor: 'background.default',
      }}
    >
      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          p: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            boxShadow: theme.customShadows.raised,
          }}
        >
          {isLogin
            ? <Login  onSwitchToSignup={() => setIsLogin(false)} />
            : <Signup onSwitchToLogin={()  => setIsLogin(true)}  />}
        </Paper>
      </Box>

      {/* Image panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          flex: 1,
          p: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={themeMode === 'light' ? signupLight : singupDark}
            alt="Auth visual"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(110,15,30,0.15) 0%, rgba(18,16,18,0.2) 40%, rgba(18,16,18,0.85) 100%)',
            }}
          />
          <Stack
            spacing={1}
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              p: 4,
              color: '#FFFFFF',
            }}
          >
            <Box sx={{ width: 40, height: 3, borderRadius: 2, bgcolor: '#F2546B', mb: 1 }} />
            <Typography variant="h2" sx={{ color: '#FFFFFF', textWrap: 'balance', maxWidth: 460 }}>
              Master SQL, one query at a time
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 420, fontSize: '0.9375rem' }}>
              Practice real-world database problems, get instant feedback, and
              build the querying skills that employers look for.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
