import { MenuItem, TextField, Typography } from '@mui/material';

const COUNTRY_CODES = [
  { code: '+1',  country: 'US / Canada' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+61', country: 'Australia' },
  { code: '+55', country: 'Brazil' },
  { code: '+52', country: 'Mexico' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+7',  country: 'Russia' },
  { code: '+82', country: 'South Korea' },
  { code: '+31', country: 'Netherlands' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+41', country: 'Switzerland' },
  { code: '+48', country: 'Poland' },
];

// Country dial-code picker that matches the MUI small text fields beside it
export const CountryCodeDropdown = ({ value, onChange, sx }) => (
  <TextField
    select
    size="small"
    label="Code"
    value={value || '+1'}
    onChange={(e) => onChange(e.target.value)}
    SelectProps={{
      renderValue: (v) => v,
      MenuProps: { PaperProps: { sx: { maxHeight: 320 } } },
    }}
    sx={{ width: 96, flexShrink: 0, ...sx }}
  >
    {COUNTRY_CODES.map((c) => (
      <MenuItem key={c.code} value={c.code} sx={{ gap: 1.5, justifyContent: 'space-between' }}>
        <Typography component="span" sx={{ fontFamily: (t) => t.typography.fontFamilyMono, fontWeight: 600, fontSize: '0.8125rem' }}>
          {c.code}
        </Typography>
        <Typography component="span" variant="body2" color="text.secondary">
          {c.country}
        </Typography>
      </MenuItem>
    ))}
  </TextField>
);
