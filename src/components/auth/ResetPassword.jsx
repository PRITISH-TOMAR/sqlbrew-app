import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, Paper, Stack, Typography, TextField, Button,
  InputAdornment, IconButton, CircularProgress, useTheme,
} from '@mui/material';
import Visibility       from '@mui/icons-material/Visibility';
import VisibilityOff    from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { pingResetPassword, resetPassword } from '../../api/authApi';
import { PasswordStrengthBar } from '../../utils/helpers/PasswordStrengthBar.jsx';
import LogoImage from '../global/LogoImage.jsx';
import singupDark  from '../../assets/images/signup-dark.jpg';
import signupLight from '../../assets/images/signup-light.jpg';
import { APP_BAR_HEIGHT } from '../../config/layout.js';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { resetKey } = useParams();
  const navigate     = useNavigate();
  const themeMode    = useSelector((s) => s.theme);
  const theme        = useTheme();

  const [status,      setStatus]      = useState('loading'); // 'loading' | 'valid' | 'expired' | 'done'
  const [formData,    setFormData]    = useState({ password: '', confirmPassword: '' });
  const [submitting,  setSubmitting]  = useState(false);
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!resetKey) { setStatus('expired'); return; }
    pingResetPassword(resetKey).then((res) => {
      setStatus(res.success ? 'valid' : 'expired');
    });
  }, [resetKey]);

  const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password) { toast.error('Enter a password'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSubmitting(true);
    const res = await resetPassword({ password: formData.password, key: resetKey });
    setSubmitting(false);
    if (res.success) setStatus('done');
  };

  // ── Shared outer layout ───────────────────────────────────────────────────
  const wrapInLayout = (content) => (
    <Box sx={{ display: 'flex', height: `calc(100vh - ${APP_BAR_HEIGHT}px)`, bgcolor: 'background.default' }}>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, p: { xs: 3, sm: 6 } }}>
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
          {content}
        </Paper>
      </Box>

      {/* Image panel */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1, p: 3 }}>
        <Box sx={{ position: 'relative', width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden' }}>
          <Box
            component="img"
            src={themeMode === 'light' ? signupLight : singupDark}
            alt="Auth visual"
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />
          <Stack spacing={1} sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 4, color: '#fff' }}>
            <Typography variant="h4" fontWeight={600}>Master SQL, one query at a time</Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 420 }}>
              Practice real-world database problems, get instant feedback, and build the querying skills that employers look for.
            </Typography>
          </Stack>
        </Box>
      </Box>

    </Box>
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: `calc(100vh - ${APP_BAR_HEIGHT}px)`, bgcolor: 'background.default' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">Checking reset link…</Typography>
        </Stack>
      </Box>
    );
  }

  // ── Expired ───────────────────────────────────────────────────────────────
  if (status === 'expired') {
    return wrapInLayout(
      <Stack alignItems="center" spacing={2} py={1}>
        <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main' }} />
        <Typography variant="h5" fontWeight={600}>Link Expired</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          This password reset link has expired or is invalid. Please request a new one.
        </Typography>
        <Button variant="outlined" fullWidth size="large" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </Stack>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (status === 'done') {
    return wrapInLayout(
      <Stack alignItems="center" spacing={2} py={1}>
        <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main' }} />
        <Typography variant="h5" fontWeight={600}>Password Reset!</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Your password has been updated successfully. You can now sign in with your new password.
        </Typography>
        <Button variant="contained" fullWidth size="large" onClick={() => navigate('/login')}>
          Go to Login
        </Button>
      </Stack>
    );
  }

  // ── Valid form ────────────────────────────────────────────────────────────
  return wrapInLayout(
    <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
      <Box>
        <Typography variant="h4" fontWeight={600}>Reset Password</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Enter your new password below
        </Typography>
      </Box>

      <Box>
        <TextField
          label="New Password"
          type={showPw ? 'text' : 'password'}
          size="small"
          fullWidth
          value={formData.password}
          onChange={(e) => set('password', e.target.value)}
          inputProps={{ minLength: 8 }}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPw((v) => !v)}>
                  {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <PasswordStrengthBar password={formData.password} />
      </Box>

      <TextField
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        size="small"
        fullWidth
        value={formData.confirmPassword}
        onChange={(e) => set('confirmPassword', e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={submitting}
        sx={{ mt: 1 }}
      >
        {submitting ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
      </Button>
    </Stack>
  );
}
