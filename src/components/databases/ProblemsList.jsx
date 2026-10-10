import { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, useTheme, Box, Typography, Skeleton,
  Stack, LinearProgress, ToggleButtonGroup, ToggleButton, InputBase, Tooltip,
  IconButton, MenuItem, Select, alpha,
} from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import SolvedIcon from '@mui/icons-material/CheckCircleRounded';
import AttemptedIcon from '@mui/icons-material/TimelapseRounded';
import NotStartedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import ClearIcon from '@mui/icons-material/CloseRounded';
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import TableIcon from '@mui/icons-material/TableChartOutlined';
import ArrowIcon from '@mui/icons-material/ChevronRightRounded';
import { getSolvedIds, problemStatus, PROBLEM_STATUS } from '../../utils/helpers/solvedProblems';
import { difficultyColor } from '../../theme/palette';
import { useNavigate, useParams } from 'react-router-dom';

const LEVELS = ['all', 'easy', 'medium', 'hard'];
const MAX_TAGS = 2;

const STATUS_META = {
  [PROBLEM_STATUS.SOLVED]:      { label: 'Solved',      Icon: SolvedIcon,     tone: 'success' },
  [PROBLEM_STATUS.ATTEMPTED]:   { label: 'Attempted',   Icon: AttemptedIcon,  tone: 'warning' },
  [PROBLEM_STATUS.NOT_STARTED]: { label: 'Not started', Icon: NotStartedIcon, tone: null },
};
const STATUS_FILTERS = [
  { value: 'all', label: 'Any status' },
  { value: PROBLEM_STATUS.NOT_STARTED, label: 'Not started' },
  { value: PROBLEM_STATUS.ATTEMPTED,   label: 'Attempted' },
  { value: PROBLEM_STATUS.SOLVED,      label: 'Solved' },
];

// Lists may arrive as arrays or comma-separated strings
const toList = (v) => (Array.isArray(v) ? v : String(v ?? '').split(',')).map((s) => String(s).trim()).filter(Boolean);
const tablesOf = (item) => toList(item?.tableNames ?? item?.tables);
const tagsOf   = (item) => toList(item?.tags);

const difficultyKey = (v) => {
  const k = String(v || '').toLowerCase();
  if (k === 'advanced') return 'hard';
  if (k === 'beginner') return 'easy';
  if (k === 'intermediate') return 'medium';
  return k;
};

// ── Cells ────────────────────────────────────────────────────────────────────

function DifficultyLabel({ value }) {
  const theme = useTheme();
  const color = difficultyColor(theme, value);
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: '0.875rem', fontWeight: 600, color, textTransform: 'capitalize' }}>
      <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />
      {value || '—'}
    </Box>
  );
}

function StatusPill({ status }) {
  const theme = useTheme();
  const { label, Icon, tone } = STATUS_META[status];
  const color = tone ? theme.palette[tone].main : theme.palette.text.secondary;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.6, whiteSpace: 'nowrap',
        px: 1, py: 0.35, borderRadius: 999, fontSize: '0.8125rem', fontWeight: 600,
        color, bgcolor: tone ? alpha(color, theme.palette.mode === 'dark' ? 0.14 : 0.09) : 'transparent',
        border: tone ? '1px solid transparent' : '1px solid', borderColor: tone ? 'transparent' : 'divider',
      }}
    >
      <Icon sx={{ fontSize: 15 }} />
      {label}
    </Box>
  );
}

function TagChips({ tags }) {
  if (!tags.length) return <Box component="span" sx={{ color: 'text.disabled' }}>—</Box>;
  const shown = tags.slice(0, MAX_TAGS);
  const rest  = tags.slice(MAX_TAGS);
  return (
    <Stack direction="row" gap={0.5} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
      {shown.map((t) => (
        <Box
          key={t}
          component="span"
          sx={{
            fontSize: '0.75rem', fontWeight: 600, px: 0.9, py: 0.2, borderRadius: 1.5, whiteSpace: 'nowrap',
            bgcolor: 'background.subtle', color: 'text.secondary', border: '1px solid', borderColor: 'divider',
          }}
        >
          {t}
        </Box>
      ))}
      {rest.length > 0 && (
        <Tooltip title={rest.join(', ')}>
          <Box component="span" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap', px: 0.25 }}>
            +{rest.length}
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
}

function ProblemRow({ number, item, dbId, problemIds, status }) {
  const theme    = useTheme();
  const navigate = useNavigate();
  const open     = () => navigate(`/sql/${dbId}/${item?.id}`, { state: { problemIds } });
  const tables   = tablesOf(item);

  return (
    <TableRow
      hover
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter') open(); }}
      sx={{
        cursor: 'pointer',
        '&:last-child td': { border: 0 },
        '&:hover .problem-title, &:focus-visible .problem-title': { color: 'primary.main' },
        '&:hover .row-arrow': { opacity: 1, transform: 'translateX(0)' },
        '&:focus-visible': { outline: 'none', bgcolor: 'action.focus' },
      }}
    >
      <TableCell sx={{ width: 52, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
        {number}
      </TableCell>

      <TableCell sx={{ minWidth: { sm: 260 } }}>
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Typography className="problem-title" sx={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.4, transition: 'color .15s' }}>
            {item?.title}
          </Typography>
          {item?.locked && <LockIcon sx={{ fontSize: 15, color: 'text.disabled' }} />}
        </Stack>
        {tables.length > 0 && (
          <Stack direction="row" alignItems="center" gap={0.6} sx={{ mt: 0.4, color: 'text.secondary', minWidth: 0 }}>
            <TableIcon sx={{ fontSize: 14, flexShrink: 0 }} />
            <Typography
              component="span"
              sx={{ fontFamily: theme.typography.fontFamilyMono, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: '58vw', sm: 340 } }}
              title={tables.join(', ')}
            >
              {tables.join(', ')}
            </Typography>
          </Stack>
        )}
        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 1, display: { xs: 'flex', sm: 'none' } }}>
          <DifficultyLabel value={item?.difficulty} />
          <StatusPill status={status} />
        </Stack>
      </TableCell>

      <TableCell sx={{ width: 220, display: { xs: 'none', md: 'table-cell' } }}>
        <TagChips tags={tagsOf(item)} />
      </TableCell>

      <TableCell sx={{ width: 120, display: { xs: 'none', sm: 'table-cell' } }}>
        <DifficultyLabel value={item?.difficulty} />
      </TableCell>

      <TableCell sx={{ width: 140, display: { xs: 'none', sm: 'table-cell' } }}>
        <StatusPill status={status} />
      </TableCell>

      <TableCell align="right" sx={{ width: 40, pl: 0, display: { xs: 'none', sm: 'table-cell' } }}>
        <ArrowIcon
          className="row-arrow"
          sx={{ fontSize: 20, color: 'text.secondary', opacity: 0, transform: 'translateX(-4px)', transition: 'opacity .15s, transform .15s', display: 'block' }}
        />
      </TableCell>
    </TableRow>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton variant="text" width={18} /></TableCell>
      <TableCell><Skeleton variant="text" width="60%" /><Skeleton variant="text" width="35%" /></TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="rounded" width={110} height={20} /></TableCell>
      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton variant="text" width={60} /></TableCell>
      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton variant="rounded" width={96} height={24} /></TableCell>
      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} />
    </TableRow>
  );
}

function ProgressSummary({ counts, total }) {
  const theme = useTheme();
  const pct = (n) => (total ? (n / total) * 100 : 0);
  return (
    <Box sx={{ minWidth: { md: 300 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.75 }}>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>Your progress</Typography>
        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {counts.solved} / {total} solved
        </Typography>
      </Stack>
      {/* Two-part bar: solved, then attempted */}
      <Box sx={{ position: 'relative', height: 8, borderRadius: 8, bgcolor: 'background.subtle', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ position: 'absolute', inset: 0, width: `${pct(counts.solved) + pct(counts.attempted)}%`, bgcolor: alpha(theme.palette.warning.main, 0.55) }} />
        <Box sx={{ position: 'absolute', inset: 0, width: `${pct(counts.solved)}%`, bgcolor: 'success.main' }} />
      </Box>
      <Stack direction="row" gap={2} sx={{ mt: 0.75 }}>
        {[
          ['Solved', counts.solved, 'success.main'],
          ['Attempted', counts.attempted, alpha(theme.palette.warning.main, 0.75)],
          ['Not started', counts.notStarted, 'divider'],
        ].map(([label, n, c]) => (
          <Stack key={label} direction="row" alignItems="center" gap={0.6}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c }} />
            <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {label} {n}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProblemsList({ items, loading, title }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { dbId } = useParams();
  const [level,  setLevel]  = useState('all');
  const [status, setStatus] = useState('all');
  const [query,  setQuery]  = useState('');

  const solvedIds = getSolvedIds();
  const withStatus = useMemo(
    () => items.map((item) => ({ item, status: problemStatus(item, solvedIds) })),
    // solvedIds is re-read each render from storage; items drive the list
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  const counts = {
    solved:     withStatus.filter((r) => r.status === PROBLEM_STATUS.SOLVED).length,
    attempted:  withStatus.filter((r) => r.status === PROBLEM_STATUS.ATTEMPTED).length,
    notStarted: withStatus.filter((r) => r.status === PROBLEM_STATUS.NOT_STARTED).length,
  };

  const q = query.trim().toLowerCase();
  const rows = withStatus
    .filter(({ item }) => level === 'all' || difficultyKey(item?.difficulty) === level)
    .filter(({ status: s }) => status === 'all' || s === status)
    .filter(({ item }) => !q
      || item?.title?.toLowerCase().includes(q)
      || tagsOf(item).some((t) => t.toLowerCase().includes(q))
      || tablesOf(item).some((t) => t.toLowerCase().includes(q)));

  // Prev/next in the solver follows what the user is looking at
  const visibleIds = rows.map(({ item }) => item?.id);
  const filtered = level !== 'all' || status !== 'all' || q;
  const clearFilters = () => { setLevel('all'); setStatus('all'); setQuery(''); };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 1180, mx: 'auto' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" gap={2.5}>
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate('/sql')}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 1, p: 0,
              border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit',
              fontSize: '0.875rem', fontWeight: 600, color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <BackIcon sx={{ fontSize: 16 }} /> All datasets
          </Box>
          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.625rem', md: '2rem' } }}>
            {title || <Skeleton width={260} />}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: '0.9375rem', color: 'text.secondary' }}>
            {loading ? 'Loading problems…' : `${items.length} problem${items.length === 1 ? '' : 's'}`}
          </Typography>
        </Box>
        {!loading && items.length > 0 && <ProgressSummary counts={counts} total={items.length} />}
      </Stack>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }}>
        <ToggleButtonGroup exclusive size="small" value={level} onChange={(_, v) => v && setLevel(v)} aria-label="Filter by difficulty">
          {LEVELS.map((l) => (
            <ToggleButton key={l} value={l} sx={{ px: 1.5, textTransform: 'capitalize', fontSize: '0.875rem' }}>
              {l === 'all' ? 'All' : l}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          inputProps={{ 'aria-label': 'Filter by status' }}
          sx={{ minWidth: 150, height: 36, fontSize: '0.875rem' }}
        >
          {STATUS_FILTERS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
        </Select>

        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }} />

        <Box
          component="label"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1, pl: 1.25, pr: 0.5, height: 38, width: { xs: '100%', sm: 300 },
            border: '1px solid', borderColor: 'border', borderRadius: 2, bgcolor: 'background.paper',
            '&:focus-within': { borderColor: 'primary.main', boxShadow: theme.customShadows.primary },
          }}
        >
          <SearchIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
          <InputBase
            placeholder="Search by title, tag or table"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputProps={{ 'aria-label': 'Search problems' }}
            sx={{ flex: 1, fontSize: '0.875rem' }}
          />
          {query && (
            <IconButton size="small" aria-label="Clear search" onClick={() => setQuery('')}>
              <ClearIcon sx={{ fontSize: 17 }} />
            </IconButton>
          )}
        </Box>
      </Stack>

      {/* Table */}
      <TableContainer
        sx={{
          border: '1px solid', borderColor: 'divider', borderRadius: 3,
          bgcolor: 'background.paper', overflowX: 'auto',
          boxShadow: theme.customShadows.card,
        }}
      >
        <Table sx={{ minWidth: { sm: 640 } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 52 }}>#</TableCell>
              <TableCell>Problem</TableCell>
              <TableCell sx={{ width: 220, display: { xs: 'none', md: 'table-cell' } }}>Tags</TableCell>
              <TableCell sx={{ width: 120, display: { xs: 'none', sm: 'table-cell' } }}>Difficulty</TableCell>
              <TableCell sx={{ width: 140, display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
              <TableCell sx={{ width: 40, display: { xs: 'none', sm: 'table-cell' } }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : rows.map(({ item, status: s }, i) => (
                  // Numbering follows what's visible, not the database id
                  <ProblemRow key={item?.id ?? i} number={i + 1} item={item} dbId={dbId} problemIds={visibleIds} status={s} />
                ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 7, px: 2, textAlign: 'center', border: 0 }}>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                    {items.length === 0 ? 'No problems in this dataset yet' : 'No problems match these filters'}
                  </Typography>
                  {filtered && (
                    <Box
                      component="button" type="button" onClick={clearFilters}
                      sx={{ border: 0, bgcolor: 'transparent', p: 0, font: 'inherit', fontSize: '0.875rem', fontWeight: 600, color: 'primary.main', cursor: 'pointer' }}
                    >
                      Clear filters
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && rows.length > 0 && (
        <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', px: 0.5 }}>
          {filtered ? `Showing ${rows.length} of ${items.length} problems. ` : ''}
          Press <Box component="kbd" sx={kbd(theme)}>Enter</Box> on a row to open it. In the editor,{' '}
          <Box component="kbd" sx={kbd(theme)}>Ctrl</Box> + <Box component="kbd" sx={kbd(theme)}>Enter</Box> runs your query.
        </Typography>
      )}
    </Box>
  );
}

const kbd = (theme) => ({
  fontFamily: theme.typography.fontFamily, fontSize: '0.6875rem', fontWeight: 600,
  px: 0.6, py: 0.1, mx: 0.25, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
  color: 'text.primary', boxShadow: `0 1px 0 ${alpha(theme.palette.text.primary, 0.08)}`,
});
