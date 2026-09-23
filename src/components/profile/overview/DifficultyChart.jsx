import { Box, Typography, Paper, Skeleton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';

const SEGMENTS = [
  { key: 'easy',   label: 'Easy',   color: '#22c55e' },
  { key: 'medium', label: 'Medium', color: '#f59e0b' },
  { key: 'hard',   label: 'Hard',   color: '#ef4444' },
];

// SVG donut: each segment uses stroke-dasharray on a shared circle
function DonutChart({ segments, total, size = 120, stroke = 18 }) {
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
    >
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={stroke} />
      {total > 0 && segments.map((seg) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle
            key={seg.key}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function DifficultyChart({ data, loading }) {
  const easy   = data?.easy   ?? 0;
  const medium = data?.medium ?? 0;
  const hard   = data?.hard   ?? 0;
  const total  = easy + medium + hard;

  const segs = [
    { key: 'easy',   value: easy,   color: '#22c55e' },
    { key: 'medium', value: medium, color: '#f59e0b' },
    { key: 'hard',   value: hard,   color: '#ef4444' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BarChartIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={600}>Solved by Difficulty</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Box sx={{ flex: 1 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="text" width="80%" sx={{ mb: 0.5 }} />)}
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Donut */}
          <Box sx={{ position: 'relative', flexShrink: 0 }}>
            <DonutChart segments={segs} total={total || 1} />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" fontWeight={700}>{total}</Typography>
              <Typography variant="caption" color="text.secondary">Solved</Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ flex: 1, minWidth: 80 }}>
            {SEGMENTS.map(({ key, label, color }) => {
              const val = data?.[key] ?? 0;
              return (
                <Box key={key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>{val}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
