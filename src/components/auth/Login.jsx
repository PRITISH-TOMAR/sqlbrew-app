import { useState } from 'react';
import {
  Stack, TextField, Typography, Button, Checkbox,
  FormControlLabel, Link, InputAdornment, IconButton,
  CircularProgress, Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword, loginUser } from '../../api/authApi';

const validateEmail = (email) => {
  const ok = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!ok) toast.error('Enter your email above, then click “Forgot password?” again');
  return ok;
};

export default function Login({ onSwitchToSignup }) {
  const loading  = useSelector((s) => s.auth.loading);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPw,   setShowPw]   = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(formData);
    if (res.success) navigate(location.state?.from || '/', { replace: true });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;
    setForgotLoading(true);
    await forgotPassword(formData.email);
    setForgotLoading(false);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
      <Box>
        <Typography variant="h2" component="h1">Welcome back</Typography>
        <Typography variant="body1" color="text.secondary" mt={0.75}>
          Sign in to pick up where you left off.
        </Typography>
      </Box>

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
        fullWidth
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required
      />

      <TextField
        label="Password"
        type={showPw ? 'text' : 'password'}
        autoComplete="current-password"
        fullWidth
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={formData.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
            />
          }
          label={<Typography variant="body2">Remember me</Typography>}
        />
        <Link
          component="button"
          type="button"
          variant="body2"
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          underline="hover"
        >
          {forgotLoading ? <CircularProgress size={14} /> : 'Forgot password?'}
        </Link>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
      </Button>

      <Typography variant="body2" align="center" color="text.secondary">
        Don't have an account?{' '}
        <Link component="button" type="button" variant="body2" onClick={onSwitchToSignup} underline="hover">
          Create one
        </Link>
      </Typography>
    </Stack>
  );
}
