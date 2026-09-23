import { Box, Typography, Paper, LinearProgress, Skeleton } from '@mui/material';
import StorageIcon from '@mui/icons-material/StorageOutlined';

export default function FavouriteDatasets({ data, loading }) {
  const items = data ?? [];
  const maxVal = items.length > 0 ? Math.max(...items.map((d) => d.count ?? 0)) : 1;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <StorageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight={600}>Favourite Datasets</Typography>
      </Box>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ mb: 1.5 }}>
            <Skeleton variant="text" width="60%" sx={{ mb: 0.5 }} />
            <Skeleton variant="rounded" height={6} />
          </Box>
        ))
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          No dataset activity yet.
        </Typography>
      ) : (
        items.map((item, i) => {
          const pct = maxVal > 0 ? Math.round((item.count / maxVal) * 100) : 0;
          return (
            <Box key={item.name ?? i} sx={{ mb: 1.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: 14, fontWeight: 600 }}>
                    {i + 1}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>{item.name ?? '—'}</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600} color="text.secondary">{item.count ?? 0}</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'divider',
                  '& .MuiLinearProgress-bar': { borderRadius: 3 },
                }}
              />
            </Box>
          );
        })
      )}
    </Paper>
  );
}
