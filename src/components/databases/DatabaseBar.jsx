import {
  Box, Typography, Chip, Stack, Divider, useTheme, alpha,
} from '@mui/material';
import TableIcon from '@mui/icons-material/TableChartOutlined';
import TimeIcon from '@mui/icons-material/AccessTimeOutlined';

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

      {/* Difficulty + stats row */}
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {database.difficulty && (
          <Chip
            label={database.difficulty}
            color={diffColor}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
          />
        )}
        {database.tableCount > 0 && (
          <Chip
            icon={<TableIcon sx={{ fontSize: '14px !important' }} />}
            label={`${database.tableCount} Tables`}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
        {database.estimatedTime && (
          <Chip
            icon={<TimeIcon sx={{ fontSize: '14px !important' }} />}
            label={database.estimatedTime}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {database.tags?.length > 0 && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {database.tags.map((t) => (
                <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
              ))}
            </Box>
          </Stack>
        </>
      )}

      {database.skills?.length > 0 && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {database.skills.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.25),
                  }}
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
