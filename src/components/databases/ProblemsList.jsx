import { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, useTheme, Box, Typography, Skeleton,
  Stack, LinearProgress, ToggleButtonGroup, ToggleButton, InputBase, Tooltip, alpha,
} from '@mui/material';
import StarIcon from '@mui/icons-material/StarBorderRounded';
import BookmarkIcon from '@mui/icons-material/BookmarkBorderRounded';
import LockIcon from '@mui/icons-material/LockOutlined';
import SolvedIcon from '@mui/icons-material/CheckCircleRounded';
import UnsolvedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import { getSolvedIds, isSolvedFromApi } from '../../utils/helpers/solvedProblems';
import { difficultyColor } from '../../theme/palette';
import { useNavigate, useParams } from 'react-router-dom';

const LEVELS = ['all', 'easy', 'medium', 'hard'];

function DifficultyLabel({ value }) {
  const theme = useTheme();
  const color = difficultyColor(theme, value);
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75,
        fontSize: '0.8125rem', fontWeight: 600, color, textTransform: 'capitalize',
      }}
    >
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      {value || '—'}
    </Box>
  );
}

function ProblemRow({ index, item, dbId, problemIds, solved }) {
  const navigate = useNavigate();
  const open = () => navigate(`/sql/${dbId}/${item?.id}`, { state: { problemIds } });

  return (
    <TableRow
      hover
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter') open(); }}
      sx={{
        cursor: 'pointer',
        '&:last-child td, &:last-child th': { border: 0 },
        '&:hover .problem-title, &:focus-visible .problem-title': { color: 'primary.main' },
        '&:focus-visible': { outline: 'none', bgcolor: 'action.focus' },
      }}
    >
      <TableCell sx={{ width: 48, pr: 0 }}>
        {solved
          ? <Tooltip title="Solved"><SolvedIcon sx={{ fontSize: 18, color: 'success.main', display: 'block' }} /></Tooltip>
          : <UnsolvedIcon sx={{ fontSize: 18, color: 'divider', display: 'block' }} />}
      </TableCell>

      <TableCell sx={{ width: 56, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{index}</TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography className="problem-title" variant="body1" fontWeight={600} sx={{ transition: 'color .15s' }}>
            {item?.title}
          </Typography>
          {item?.locked && <LockIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
        </Box>
      </TableCell>

      <TableCell sx={{ width: 130 }}>
        <DifficultyLabel value={item?.difficulty} />
      </TableCell>

      <TableCell align="right" sx={{ width: 96, color: 'text.secondary', whiteSpace: 'nowrap' }}>
        <Tooltip title="Bookmark">
          <IconButton size="small" onClick={(e) => e.stopPropagation()} aria-label="Bookmark problem">
            <BookmarkIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Favourite">
          <IconButton size="small" onClick={(e) => e.stopPropagation()} aria-label="Favourite problem" sx={{ '&:hover': { color: 'warning.main' } }}>
            <StarIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton variant="circular" width={18} height={18} /></TableCell>
      <TableCell><Skeleton variant="text" width={20} /></TableCell>
      <TableCell><Skeleton variant="text" width="60%" /></TableCell>
      <TableCell><Skeleton variant="text" width={60} /></TableCell>
      <TableCell align="right"><Skeleton variant="text" width={50} sx={{ ml: 'auto' }} /></TableCell>
    </TableRow>
  );
}

export default function ProblemsList({ items, loading, title }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { dbId } = useParams();
  const [level, setLevel]   = useState('all');
  const [query, setQuery]   = useState('');

  const problemIds = items.map((item) => item?.id);
  const solvedIds  = getSolvedIds();
  const isSolved   = (item) => solvedIds.has(String(item?.id)) || isSolvedFromApi(item);
  const solvedCount = items.filter(isSolved).length;
  const pct = items.length ? Math.round((solvedCount / items.length) * 100) : 0;

  const rows = useMemo(() => items
    .map((item, idx) => ({ item, index: idx + 1 }))
    .filter(({ item }) => level === 'all' || difficultyKey(item?.difficulty) === level)
    .filter(({ item }) => !query || item?.title?.toLowerCase().includes(query.toLowerCase())),
  [items, level, query]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" gap={2}>
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate('/sql')}
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5, mb: 1, p: 0,
              border: 0, bgcolor: 'transparent', cursor: 'pointer', font: 'inherit',
              fontSize: '0.8125rem', fontWeight: 600, color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <BackIcon sx={{ fontSize: 16 }} /> All datasets
          </Box>
          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.5rem', md: '1.875rem' } }}>
            {title || <Skeleton width={260} />}
          </Typography>
        </Box>

        <Box sx={{ minWidth: 240 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="body2" color="text.secondary">Progress</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
              {solvedCount} / {items.length} solved
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ height: 8, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})` } }}
          />
        </Box>
      </Stack>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }} justifyContent="space-between">
        <ToggleButtonGroup
          exclusive
          size="small"
          value={level}
          onChange={(_, v) => v && setLevel(v)}
          aria-label="Filter by difficulty"
        >
          {LEVELS.map((l) => (
            <ToggleButton key={l} value={l} sx={{ px: 1.5, py: 0.5, textTransform: 'capitalize', fontSize: '0.8125rem' }}>
              {l === 'all' ? 'All' : l}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box
          component="label"
          sx={{
            display: 'flex', alignItems: 'center', gap: 1, px: 1.25, height: 36, width: { xs: '100%', sm: 260 },
            border: '1px solid', borderColor: 'border', borderRadius: 2, bgcolor: 'background.paper',
            '&:focus-within': { borderColor: 'primary.main', boxShadow: theme.customShadows.primary },
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <InputBase
            placeholder="Filter problems"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            inputProps={{ 'aria-label': 'Filter problems by title' }}
            sx={{ flex: 1, fontSize: '0.8125rem' }}
          />
        </Box>
      </Stack>

      {/* Table */}
      <TableContainer
        sx={{
          border: '1px solid', borderColor: 'divider', borderRadius: 3,
          bgcolor: 'background.paper', overflow: 'auto',
          boxShadow: theme.customShadows.card,
        }}
      >
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 48, pr: 0 }}><Box component="span" sx={visuallyHidden}>Status</Box></TableCell>
              <TableCell sx={{ width: 56 }}>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell sx={{ width: 130 }}>Difficulty</TableCell>
              <TableCell align="right" sx={{ width: 96 }}><Box component="span" sx={visuallyHidden}>Actions</Box></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : rows.map(({ item, index }) => (
                  <ProblemRow key={item?.id} index={index} item={item} dbId={dbId} problemIds={problemIds} solved={isSolved(item)} />
                ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: 'text.secondary', border: 0 }}>
                  {items.length === 0 ? 'No problems in this dataset yet.' : 'No problems match these filters.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && items.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
          Tip: press <Box component="kbd" sx={kbd(theme)}>Enter</Box> on a focused row to open it.
          In the editor, <Box component="kbd" sx={kbd(theme)}>Ctrl</Box> + <Box component="kbd" sx={kbd(theme)}>Enter</Box> runs your query.
        </Typography>
      )}
    </Box>
  );
}

const difficultyKey = (v) => {
  const k = String(v || '').toLowerCase();
  if (k === 'advanced') return 'hard';
  if (k === 'beginner') return 'easy';
  if (k === 'intermediate') return 'medium';
  return k;
};

const visuallyHidden = {
  // px strings on purpose: in MUI sx a bare `1` means 100%
  border: 0, clip: 'rect(0 0 0 0)', height: '1px', margin: '-1px', overflow: 'hidden', padding: 0, position: 'absolute', width: '1px', whiteSpace: 'nowrap',
};

const kbd = (theme) => ({
  fontFamily: theme.typography.fontFamily, fontSize: '0.6875rem', fontWeight: 600,
  px: 0.6, py: 0.1, mx: 0.25, borderRadius: 1, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper',
  color: 'text.primary', boxShadow: `0 1px 0 ${alpha(theme.palette.text.primary, 0.08)}`,
});
