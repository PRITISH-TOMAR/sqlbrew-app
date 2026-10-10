import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Garnet brand mark: magnifier ring around a database stack (same art as /public/brewQuery.svg)
export function LogoMark({ size = 28 }) {
  return (
    <Box component="svg" viewBox="0 0 128 128" sx={{ width: size, height: size, display: 'block', flexShrink: 0 }} aria-hidden="true">
      <defs>
        <linearGradient id="bq-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#C0283F" />
          <stop offset="1" stopColor="#5A0F1C" />
        </linearGradient>
        <linearGradient id="bq-db" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FAD3D8" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="url(#bq-bg)" />
      <path
        fill="#FFFFFF"
        fillRule="evenodd"
        d="M64 18a46 46 0 1 0 28.7 81.9l13.1 11.5a5 5 0 0 0 6.6-7.5L99.3 92.4A46 46 0 0 0 64 18Zm0 10a36 36 0 1 1-22.2 64.3l7.5-8A25 25 0 1 0 64 39a25 25 0 0 0-14.5 45.4l-7.5 8A36 36 0 0 1 64 28Zm0 20a16 16 0 0 1 10.2 28.3l-7.8-6.8a6 6 0 1 0-7.9 7.5l7.8 6.8A16 16 0 0 1 64 48Z"
      />
      <g fill="url(#bq-db)">
        <ellipse cx="64" cy="49" rx="17" ry="6.5" />
        <path d="M47 49v13c0 3.6 7.6 6.5 17 6.5S81 65.6 81 62V49c0 3.6-7.6 6.5-17 6.5S47 52.6 47 49Z" />
        <path d="M47 62v13c0 3.6 7.6 6.5 17 6.5S81 78.6 81 75V62c0 3.6-7.6 6.5-17 6.5S47 65.6 47 62Z" />
      </g>
    </Box>
  );
}

export default function LogoImage({ size = 30, showWordmark = true }) {
  const navigate = useNavigate();

  return (
    <Box
      component="a"
      href="/"
      aria-label="BrewQuery home"
      onClick={(e) => { e.preventDefault(); navigate('/'); }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        userSelect: 'none',
        textDecoration: 'none',
        color: 'text.primary',
        flexShrink: 0,
        borderRadius: 1,
        '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 },
      }}
    >
      <LogoMark size={size} />
      {showWordmark && (
        <Typography
          component="span"
          sx={{ fontWeight: 800, fontSize: size * 0.6, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          Brew
          <Box component="span" sx={{ color: 'primary.main' }}>Query</Box>
        </Typography>
      )}
    </Box>
  );
}
