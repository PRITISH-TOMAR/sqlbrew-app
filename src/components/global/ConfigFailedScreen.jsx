import { Box, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { clearConfig } from '../../redux/slices/configSlice.js';

export default function ConfigFailedScreen() {
  const dispatch = useDispatch();

  const handleReload = () => {
    dispatch(clearConfig());
    window.location.reload();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        gap: 3,
        zIndex: 9999,
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="text.secondary">
        Something went wrong. Please reload to try again.
      </Typography>
      <Button variant="outlined" onClick={handleReload}>
        Reload
      </Button>
    </Box>
  );
}
