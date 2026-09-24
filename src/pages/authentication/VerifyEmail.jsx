import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, Paper, Stack, Typography, CircularProgress, Button, useTheme,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Signup from '../../components/auth/Signup.jsx';
import LogoImage from '../../components/global/LogoImage.jsx';
import singupDark  from '../../assets/images/signup-dark.jpg';
import signupLight from '../../assets/images/signup-light.jpg';
import { verifyEmailLink } from '../../api/authApi';
import { APP_BAR_HEIGHT } from '../../config/layout.js';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const themeMode      = useSelector((s) => s.theme);
  const theme          = useTheme();
  const token          = searchParams.get('token');

  const [status,       setStatus]       = useState('loading'); // 'loading' | 'success' | 'error'
  const [verifiedData, setVerifiedData] = useState(null);      // { key, email }

  useEffect(() => {
    if (!token) { setStatus('error'); return; }

    verifyEmailLink(token).then((res) => {
      if (res.success) {
        setVerifiedData(res.data);
        setStatus('success');
        // Clear token from URL so the link can't be reused from browser history
        navigate('/verify-email', { replace: true });
      } else {
        setStatus('error');
      }
    });
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          bgcolor: 'background.default',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">
            Verifying your email…
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          bgcolor: 'background.default',
          gap: 4,
          p: 3,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <LogoImage />
        </Box>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: theme.shadows[1],
          }}
        >
          <Stack alignItems="center" spacing={2} py={1}>
            <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main' }} />
            <Typography variant="h5" fontWeight={600}>Link Expired</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              This verification link has expired or is invalid. Please request a
              new one from the sign up page.
            </Typography>
            <Button variant="outlined" fullWidth size="large" onClick={() => navigate('/login')}>
              Back to Sign Up
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // ── Success: render signup form with email pre-filled ─────────────────────
  return (
    <Box
      sx={{
        display: 'flex',
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
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <LogoImage />
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: theme.shadows[1],
          }}
        >
          <Signup
            onSwitchToLogin={() => navigate('/login')}
            preloadedEmail={verifiedData.email}
            preloadedEmailKey={verifiedData}
          />
        </Paper>
      </Box>

      {/* Image panel */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, p: 3 }}>
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
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
            }}
          />
          <Stack
            spacing={1}
            sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 4, color: '#fff' }}
          >
            <Typography variant="h4" fontWeight={600}>
              Master SQL, one query at a time
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420 }}>
              Practice real-world database problems, get instant feedback, and
              build the querying skills that employers look for.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
