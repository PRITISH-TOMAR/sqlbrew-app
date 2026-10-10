import { useState } from 'react';
import {
  Stack, TextField, Typography, Button, Link, InputAdornment,
  IconButton, CircularProgress, Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendVerificationLink, signupUser, loginUser } from '../../api/authApi';
import { CountryCodeDropdown } from '../../utils/classes/CountryCodeDropDown.jsx';
import { PasswordStrengthBar } from '../../utils/helpers/PasswordStrengthBar.jsx';

const validateEmail = (email) => {
  const ok = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!ok) toast.error('Please enter a valid email address');
  return ok;
};

const FIELD_LABELS = {
  firstName: 'first name', lastName: 'last name', countryCode: 'country code', contact: 'phone number',
  email: 'email', password: 'password', confirmPassword: 'password confirmation',
};

const validateForm = (formData) => {
  const empty = Object.entries(formData).filter(([k, v]) => k in FIELD_LABELS && (v === null || v === undefined || v === ''));
  if (empty.length) { toast.error(`Please fill in your ${empty.map(([k]) => FIELD_LABELS[k]).join(', ')}`); return false; }
  if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false; }
  return true;
};

export default function Signup({ onSwitchToLogin, preloadedEmail = '', preloadedEmailKey = null }) {
  const loading  = useSelector((s) => s.auth.loading);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', countryCode: '+91',
    contact: '', email: preloadedEmail, password: '', confirmPassword: '',
  });
  const [emailKey,    setEmailKey]    = useState(preloadedEmailKey ?? {});
  const [verified,    setVerified]    = useState(!!preloadedEmailKey);
  const [linkSending, setLinkSending] = useState(false);
  const [showPw,      setShowPw]      = useState(false);

  const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;
    setLinkSending(true);
    await sendVerificationLink(formData.email);
    setLinkSending(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, emailKey };
    if (!validateForm(payload)) return;
    const res = await signupUser(payload);
    if (res.success) {
      const loginRes = await loginUser({ email: formData.email, password: formData.password, rememberMe: false });
      if (loginRes.success) navigate('/', { replace: true });
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
      <Box>
        <Typography variant="h2" component="h1">Create your account</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Start solving SQL challenges on real datasets
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <TextField label="First Name" size="small" fullWidth value={formData.firstName}
          onChange={(e) => set('firstName', e.target.value)} required />
        <TextField label="Last Name"  size="small" fullWidth value={formData.lastName}
          onChange={(e) => set('lastName',  e.target.value)} required />
      </Stack>

      {/* Phone */}
      <Stack direction="row" spacing={1}>
        <CountryCodeDropdown
          value={formData.countryCode}
          onChange={(v) => set('countryCode', v)}
        />
        <TextField
          label="Phone Number"
          type="tel"
          size="small"
          fullWidth
          value={formData.contact}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '');
            if (v.length <= 10) set('contact', v);
          }}
          required
        />
      </Stack>

      {/* Email + verify */}
      {verified ? (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 1.5,
            py: 1,
            border: '1px solid',
            borderColor: 'success.main',
            borderRadius: 2,
            bgcolor: 'success.lighter',
          }}
        >
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          <Typography variant="body2" color="text.primary" sx={{ flex: 1, fontWeight: 500 }}>
            {formData.email}
          </Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
            Verified
          </Typography>
        </Stack>
      ) : (
        <TextField
          label="Email"
          type="email"
          size="small"
          fullWidth
          value={formData.email}
          onChange={(e) => set('email', e.target.value)}
          required
          helperText="We'll email you a link to verify this address before you can sign up."
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSendLink}
                  disabled={linkSending}
                  startIcon={linkSending ? null : <MailOutlineIcon sx={{ fontSize: '16px !important' }} />}
                  sx={{ minWidth: 76, height: 28, fontSize: '0.75rem', mr: -0.5 }}
                >
                  {linkSending ? <CircularProgress size={14} color="inherit" /> : 'Verify'}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      )}

      {/* Password */}
      <Box>
        <TextField
          label="Password"
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
        type="password"
        size="small"
        fullWidth
        value={formData.confirmPassword}
        onChange={(e) => set('confirmPassword', e.target.value)}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!verified || loading}
        sx={{ mt: 1 }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
      </Button>

      <Typography variant="body2" align="center" color="text.secondary">
        Already have an account?{' '}
        <Link component="button" type="button" variant="body2" onClick={onSwitchToLogin} underline="hover">
          Sign in
        </Link>
      </Typography>
    </Stack>
  );
}
