import { Box, Typography, Paper, Select, MenuItem, Skeleton, useTheme } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import StorageIcon from '@mui/icons-material/StorageOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import TimerIcon from '@mui/icons-material/TimerOutlined';
import { alpha } from '@mui/material/styles';
import { useState } from 'react';

const CARDS = [
  {
    key:     'totalSubmissions',
    label:   'Total Submissions',
    Icon:    StorageIcon,
    tone:    'primary',
  },
  {
    key:     'correctSubmissions',
    label:   'Correct Submissions',
    subKey:  'correctPct',
    subSuffix: '%',
    Icon:    CheckCircleIcon,
    tone:    'success',
  },
  {
    key:     'wrongSubmissions',
    label:   'Wrong Submissions',
    subKey:  'wrongPct',
    subSuffix: '%',
    Icon:    CancelIcon,
    tone:    'error',
  },
  {
    key:     'avgTime',
    label:   'Avg Submission Time',
    subKey:  'avgTimePct',
    subFmt:  (v) => `Faster than ${v}% of users`,
    Icon:    TimerIcon,
    tone:    'info',
  },
];

function StatCard({ cfg, stats, loading }) {
  const theme = useTheme();
  const { key, label, subKey, subSuffix, subFmt, Icon, tone } = cfg;
  const color = theme.palette[tone].main;
  const value = stats?.[key];
  const subRaw = stats?.[subKey];
  const subLabel = subRaw != null
    ? (subFmt ? subFmt(subRaw) : `${subRaw}${subSuffix ?? ''}`)
    : undefined;

  if (loading) {
    return <Skeleton variant="rounded" height={90} sx={{ flex: '1 1 45%' }} />;
  }

  return (
    <Box
      sx={{
        flex: '1 1 45%',
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: alpha(color, theme.palette.mode === 'dark' ? 0.16 : 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 20, color }} />
      </Box>
      <Box>
        <Typography variant="h4" component="p" sx={{ lineHeight: 1.2, fontVariantNumeric: 'tabular-nums' }}>
          {value ?? '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        {subLabel && (
          <Typography variant="caption" sx={{ display: 'block', color, fontSize: 11, fontWeight: 600 }}>
            {subLabel}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function StatsPanel({ stats, loading }) {
  const [period, setPeriod] = useState('all');

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BarChartIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>Your Stats</Typography>
        </Box>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ fontSize: 12, height: 32, minWidth: 100 }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {CARDS.map((cfg) => (
          <StatCard key={cfg.key} cfg={cfg} stats={stats} loading={loading} />
        ))}
      </Box>
    </Paper>
  );
}
