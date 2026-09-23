import { Box, Typography, Paper, Select, MenuItem, Skeleton, useTheme } from '@mui/material';
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useMemo, useState } from 'react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Builds a 7-row (Mon–Sun) × N-weeks grid from an array of { date, count }
function buildGrid(dataArr, weeks) {
  const dataMap = {};
  (dataArr || []).forEach(({ date, count }) => { dataMap[date] = count; });

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - weeks * 7);

  // Snap back to the Monday of that week
  const start = new Date(cutoff);
  const dow = (start.getDay() + 6) % 7; // 0=Mon … 6=Sun
  start.setDate(start.getDate() - dow);

  const grid = [];       // array of week-columns; each column = 7 day cells
  const monthMarks = {}; // weekIndex → month label (shown at start of month)
  const cur = new Date(start);

  while (cur <= today) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().split('T')[0];
      if (d === 0) {
        const wkIdx = grid.length;
        const mn = cur.getMonth();
        if (wkIdx === 0 || new Date(grid[wkIdx - 1][0].date).getMonth() !== mn) {
          monthMarks[wkIdx] = MONTH_LABELS[mn];
        }
      }
      col.push({ date: dateStr, count: dataMap[dateStr] || 0, future: cur > today });
      cur.setDate(cur.getDate() + 1);
    }
    grid.push(col);
  }

  return { grid, monthMarks };
}

function cellBg(count, theme) {
  if (count === 0) return theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  if (count === 1) return '#166534';
  if (count === 2) return '#15803d';
  if (count === 3) return '#16a34a';
  return '#22c55e';
}

const CELL = 12;
const GAP = 2;

export default function SubmissionHeatmap({ data, loading }) {
  const theme = useTheme();
  const [period, setPeriod] = useState('year');
  const weeks = period === 'year' ? 52 : period === '6months' ? 26 : 13;
  const { grid, monthMarks } = useMemo(() => buildGrid(data, weeks), [data, weeks]);

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>Submission Heatmap</Typography>
            <Typography variant="caption" color="text.secondary">
              A snapshot of your activity over the last year
            </Typography>
          </Box>
        </Box>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ fontSize: 12, height: 32, minWidth: 130 }}
        >
          <MenuItem value="year">Past 1 Year</MenuItem>
          <MenuItem value="6months">Past 6 Months</MenuItem>
          <MenuItem value="3months">Past 3 Months</MenuItem>
        </Select>
      </Box>

      {loading ? (
        <Skeleton variant="rounded" width="100%" height={110} />
      ) : (
        <Box sx={{ overflowX: 'auto', pb: 0.5 }}>
          <Box sx={{ display: 'inline-flex', flexDirection: 'column' }}>

            {/* Month labels row */}
            <Box sx={{ display: 'flex', ml: `${28 + GAP}px`, mb: `${GAP}px` }}>
              {grid.map((_, wi) => (
                <Box key={wi} sx={{ width: CELL, mr: `${GAP}px`, flexShrink: 0, overflow: 'visible' }}>
                  {monthMarks[wi] ? (
                    <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {monthMarks[wi]}
                    </Typography>
                  ) : null}
                </Box>
              ))}
            </Box>

            {/* Day-label + cell grid */}
            <Box sx={{ display: 'flex', gap: 0 }}>
              {/* Day labels */}
              <Box sx={{ display: 'flex', flexDirection: 'column', mr: `${GAP}px`, mt: 0 }}>
                {DAY_LABELS.map((d) => (
                  <Box key={d} sx={{ height: CELL, mb: `${GAP}px`, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ fontSize: 9, color: 'text.secondary', lineHeight: 1 }}>
                      {d}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Week columns */}
              {grid.map((col, wi) => (
                <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', mr: `${GAP}px` }}>
                  {col.map((cell) => (
                    <Box
                      key={cell.date}
                      title={`${cell.date}: ${cell.count} submission${cell.count !== 1 ? 's' : ''}`}
                      sx={{
                        width: CELL,
                        height: CELL,
                        mb: `${GAP}px`,
                        borderRadius: '2px',
                        bgcolor: cell.future ? 'transparent' : cellBg(cell.count, theme),
                        cursor: cell.count > 0 ? 'pointer' : 'default',
                        transition: 'opacity 0.15s',
                        '&:hover': cell.count > 0 ? {
                          opacity: 0.75,
                          outline: `1px solid ${theme.palette.primary.main}`,
                          outlineOffset: '1px',
                        } : {},
                      }}
                    />
                  ))}
                </Box>
              ))}
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', mt: 1, ml: `${28 + GAP}px` }}>
              <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', mr: 0.5 }}>Less</Typography>
              {[0, 1, 2, 3, 4].map((n) => (
                <Box key={n} sx={{ width: CELL, height: CELL, borderRadius: '2px', bgcolor: cellBg(n, theme) }} />
              ))}
              <Typography variant="caption" sx={{ fontSize: 10, color: 'text.secondary', ml: 0.5 }}>More</Typography>
            </Box>

          </Box>
        </Box>
      )}
    </Paper>
  );
}
