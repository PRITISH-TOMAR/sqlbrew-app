import { useState } from 'react';
import {
  Stack, TextField, Typography, Button, Link, InputAdornment,
  IconButton, CircularProgress, Divider, Box,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendOtpToMail, signupUser, loginUser } from '../../api/authApi';
import { CountryCodeDropdown } from '../../utils/classes/CountryCodeDropDown.jsx';
import { PasswordStrengthBar }  from '../../utils/helpers/PasswordStrengthBar.jsx';
import Otp from './OTP.jsx';

const validateEmail = (email) => {
  const ok = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  if (!ok) toast.error('INVALID EMAIL..');
  return ok;
};

const validateForm = (formData) => {
  const empty = Object.entries(formData).filter(([, v]) => v === null || v === undefined || v === '');
  if (empty.length) { toast.error(`Please fill in: ${empty.map(([k]) => k).join(', ')}`); return false; }
  if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return false; }
  return true;
};

export default function Signup({ onSwitchToLogin }) {
  const loading  = useSelector((s) => s.auth.loading);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', countryCode: '+91',
    contact: '', email: '', password: '', confirmPassword: '',
  });
  const [emailKey,    setEmailKey]    = useState({});
  const [showOtp,     setShowOtp]     = useState(false);
  const [verified,    setVerified]    = useState(false);
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [showPw,      setShowPw]      = useState(false);

  const set = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return;
    setOtpLoading(true);
    const res = await sendOtpToMail(formData.email);
    if (res.success) setShowOtp(true);
    setOtpLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, emailKey };
    if (!validateForm(payload)) return;
    const res = await signupUser(payload);
    if (res.success) {
      const loginRes = await loginUser({ email: formData.email, password: formData.password, rememberMe: false });
      if (loginRes.success) navigate('/');
    }
  };

  return (
    <>
      {showOtp && (
        <Otp
          setShowOtp={setShowOtp}
          email={formData.email}
          showOtp={showOtp}
          setVerified={setVerified}
          setEmailKey={setEmailKey}
        />
      )}

      <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
        <Box>
          <Typography variant="h4" fontWeight={600}>Sign up</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Create your account to get started
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <TextField label="First Name" size="small" fullWidth value={formData.firstName}
            onChange={(e) => set('firstName', e.target.value)} required />
          <TextField label="Last Name"  size="small" fullWidth value={formData.lastName}
            onChange={(e) => set('lastName',  e.target.value)} required />
        </Stack>

        {/* Phone */}
        <Stack direction="row" spacing={0}>
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 4px 4px 0' } }}
          />
        </Stack>

        {/* Email + verify */}
        <TextField
          label="Email"
          type="email"
          size="small"
          fullWidth
          value={formData.email}
          onChange={(e) => set('email', e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={verified || otpLoading}
                  sx={{ minWidth: 70, height: 28, fontSize: '0.75rem' }}
                >
                  {verified ? <LockIcon fontSize="small" /> : otpLoading ? <CircularProgress size={14} color="inherit" /> : 'Verify'}
                </Button>
              </InputAdornment>
            ),
          }}
        />

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
    </>
  );
}
