import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Typography } from '@mui/material';
import { WifiOff } from '@mui/icons-material';
import { dismissApiError } from '../../redux/slices/apiErrorSlice';

const TRIGGER_COUNT = 3;

export default function ApiErrorBanner() {
  const dispatch = useDispatch();
  const consecutiveFailures = useSelector((s) => s.apiError.consecutiveFailures);

  if (consecutiveFailures < TRIGGER_COUNT) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1400,
        width: { xs: '90vw', sm: 480 },
        pointerEvents: 'auto',
      }}
    >
      <Alert
        severity="error"
        icon={<WifiOff fontSize="inherit" />}
        sx={{
          borderRadius: 2,
          boxShadow: 8,
          alignItems: 'flex-start',
          '& .MuiAlert-message': { width: '100%' },
        }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => dispatch(dismissApiError())}
            sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}
          >
            Dismiss
          </Button>
        }
      >
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          An error occurred
        </Typography>
        <Typography variant="body2">
          Could not reach the server after multiple attempts. Check your connection and try again.
        </Typography>
      </Alert>
    </Box>
  );
}
