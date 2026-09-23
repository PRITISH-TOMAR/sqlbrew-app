import { Box, Typography, Paper, Skeleton, Button } from '@mui/material';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTechOutlined';
import { alpha } from '@mui/material/styles';

// Hexagonal badge shape via clip-path
function HexBadge({ color, icon, size = 56 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        bgcolor: alpha(color, 0.85),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 12px ${alpha(color, 0.5)}`,
      }}
    >
      <Box sx={{ color: '#fff', fontSize: size * 0.45, display: 'flex' }}>
        {icon}
      </Box>
    </Box>
  );
}

export default function RecentBadges({ badges, loading }) {
  const items = badges ?? [];

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MilitaryTechIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>Recent Badges</Typography>
        </Box>
        <Button size="small" variant="text" sx={{ fontSize: 12, textTransform: 'none', height: 28 }}>
          View All
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
              <Skeleton variant="rounded" width={56} height={56} />
              <Skeleton variant="text" width={60} />
            </Box>
          ))}
        </Box>
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No badges earned yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {items.map((badge, i) => (
            <Box
              key={badge.id ?? i}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}
            >
              <HexBadge
                color={badge.color ?? '#f59e0b'}
                icon={
                  <MilitaryTechIcon sx={{ fontSize: '1em' }} />
                }
              />
              <Typography variant="caption" fontWeight={600} align="center" sx={{ maxWidth: 72, lineHeight: 1.2 }}>
                {badge.name ?? '—'}
              </Typography>
              {badge.description && (
                <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 72, fontSize: 10, lineHeight: 1.2 }}>
                  {badge.description}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
