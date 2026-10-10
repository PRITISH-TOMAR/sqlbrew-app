import { AnimatePresence, motion } from 'framer-motion';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckRounded';
import NextIcon from '@mui/icons-material/ArrowForwardRounded';

// Garnet-led confetti: brand reds and roses with a few gold and green flecks
const CONFETTI_COLORS = ['#C8203A', '#F2546B', '#F5A9B3', '#F5B544', '#3DD68C', '#DC2F49'];
const MotionDiv  = motion.div;
const MotionSpan = motion.span;

// Deterministic pseudo-random in [0, 1) so render stays pure
const rand = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const CONFETTI_COUNT = 70;
const CONFETTI_PIECES = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
  const angle = (Math.PI * 2 * i) / CONFETTI_COUNT + rand(i, 1) * 0.4;
  const distance = 160 + rand(i, 2) * 220;
  const w = 6 + rand(i, 5) * 6;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 80,
    rotate: rand(i, 3) * 720 - 360,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    w,
    h: 8 + rand(i, 6) * 10,
    round: rand(i, 7) > 0.6,
    delay: rand(i, 4) * 0.15,
  };
});

function ConfettiBurst() {
  const pieces = CONFETTI_PIECES;

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
      {pieces.map((p) => (
        <MotionSpan
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 260], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 2.2, delay: p.delay, ease: 'easeOut', times: [0, 0.4, 1] }}
          style={{
            position: 'absolute',
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? '50%' : 2,
          }}
        />
      ))}
    </Box>
  );
}

/**
 * Full-panel overlay shown after an ACCEPTED submission.
 * Clicking anywhere (or "Keep going") dismisses it.
 */
export default function SolvedCelebration({ open, onClose, onNext, hasNext, firstSolve }) {
  const theme = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          key="solved-celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'absolute', inset: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: theme.palette.mode === 'dark' ? 'rgba(18,16,18,0.6)' : 'rgba(250,248,247,0.65)',
            backdropFilter: 'blur(2px)',
            overflow: 'hidden',
          }}
        >
          <ConfettiBurst />

          <MotionDiv
            initial={{ scale: 0.7, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{
                px: 4, py: 3.5, minWidth: 280, textAlign: 'center',
                bgcolor: 'background.paper', borderRadius: 4,
                border: '1px solid', borderColor: 'divider',
                boxShadow: theme.customShadows.dialog,
              }}
            >
              <MotionDiv
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                style={{ display: 'inline-flex' }}
              >
                <Box
                  sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    bgcolor: 'success.main', color: 'success.contrastText',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 0 8px ${theme.palette.success.main}33`,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 40 }} />
                </Box>
              </MotionDiv>

              <Typography variant="h5" fontWeight={800} sx={{ mt: 2 }}>
                Solved!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {firstSolve ? 'All test cases passed. Nice work!' : 'Accepted again — still got it.'}
              </Typography>

              <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 2.5 }}>
                <Button size="small" variant="outlined" color="inherit" onClick={onClose}>
                  Stay here
                </Button>
                {hasNext && (
                  <Button size="small" variant="contained" color="success" endIcon={<NextIcon />} onClick={onNext}>
                    Next problem
                  </Button>
                )}
              </Stack>
            </Box>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
