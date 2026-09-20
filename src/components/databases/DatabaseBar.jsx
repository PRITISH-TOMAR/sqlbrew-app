import {
  Box, Typography, Chip, Stack, Divider, useTheme,
} from '@mui/material';

export default function DatabaseBar({ database }) {
  const theme = useTheme();

  const diffColor = {
    easy: 'success', medium: 'warning', advanced: 'error',
  }[database.difficulty] || 'default';

  return (
    <Box
      sx={{
        height: '100%',
        borderLeft: `1px solid ${theme.palette.divider}`,
        p: 2.5,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {database.title && (
        <Typography variant="h5" fontWeight={700}>
          {database.title}
        </Typography>
      )}

      {database.difficulty && (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
            Difficulty
          </Typography>
          <Chip
            label={database.difficulty}
            color={diffColor}
            variant="outlined"
            size="small"
            sx={{ alignSelf: 'flex-start', textTransform: 'capitalize', fontWeight: 600 }}
          />
        </Stack>
      )}

      {database.tags?.length > 0 && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {database.tags.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Stack>
        </>
      )}

      {database.notes && (
        <>
          <Divider />
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Notes
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {database.notes}
            </Typography>
          </Stack>
        </>
      )}

      {database.createdAt && (
        <Typography variant="caption" color="text.disabled" sx={{ mt: 'auto' }}>
          Created {new Date(database.createdAt).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
}
