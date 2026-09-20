import { Box, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import brewQuery from '../../assets/images/brewQuery.png';

export default function LogoImage({ size = 36 }) {
  const navigate = useNavigate();
  const theme    = useTheme();

  return (
    <Box
      onClick={() => navigate('/')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={brewQuery}
        alt="BrewQuery"
        sx={{
          height: size,
          width:  size,
          objectFit: 'contain',
          filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none',
        }}
      />
    </Box>
  );
}
