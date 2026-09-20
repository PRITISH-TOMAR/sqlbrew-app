import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Card, Typography, Chip, Stack, Container, Divider,
  Pagination as MuiPagination, Skeleton, InputAdornment, TextField,
  Select, MenuItem, Button, alpha, useTheme,
} from '@mui/material';
import DatabaseIcon from '@mui/icons-material/StorageOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuestionsIcon from '@mui/icons-material/ListAltOutlined';
import TimeIcon from '@mui/icons-material/AccessTimeOutlined';
import BarChartIcon from '@mui/icons-material/BarChartOutlined';
import LayersIcon from '@mui/icons-material/LayersOutlined';
import CodeIcon from '@mui/icons-material/CodeOutlined';
import { fetchDatasetGridConfig } from '../../api/configApi';

// Fallbacks used until the config API responds
const DEFAULT_DIFFICULTY_LEVELS = ['All Levels', 'Easy', 'Medium', 'Advanced'];
const DEFAULT_DIFFICULTY_COLOR  = {
  easy:     { color: 'success', variant: 'filled' },
  medium:   { color: 'warning', variant: 'filled' },
  advanced: { color: 'error',   variant: 'filled' },
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TAG_PALETTE = ['#3b82f6', '#6366f1', '#059669', '#0891b2', '#7c3aed', '#d97706'];

const DIFF_BADGE = {
  easy:     { bg: 'rgba(34,197,94,0.14)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)'  },
  medium:   { bg: 'rgba(245,158,11,0.14)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  advanced: { bg: 'rgba(239,68,68,0.14)',  color: '#f87171', border: 'rgba(239,68,68,0.3)'  },
};

const MODE_LABELS = { mysql: 'MySQL', postgresql: 'PostgreSQL', sqlite: 'SQLite', mssql: 'MS SQL' };

// ─── Stat block (bottom row) ─────────────────────────────────────────────────

function StatBlock({ icon, label, sub }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 1.5, sm: 2 }, py: 0.5, minWidth: 0 }}>
      <Box sx={{ flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} lineHeight={1.25} noWrap>{label}</Typography>
        <Typography variant="caption" color="text.secondary" lineHeight={1.2} sx={{ display: 'block' }} noWrap>{sub}</Typography>
      </Box>
    </Box>
  );
}

// ─── Dataset Card ────────────────────────────────────────────────────────────

function DatasetCard({ item, basePath, ctaLabel, cardLabel, accentColor }) {
  const navigate = useNavigate();
  const diff     = item.difficulty?.toLowerCase();
  const badge    = DIFF_BADGE[diff] || { bg: 'rgba(148,163,184,0.14)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' };

  const modesText     = item.sqlModesAvailable?.map(m => MODE_LABELS[m] || m).join(', ') || null;
  const skillsPreview = item.skills?.length > 0
    ? item.skills.slice(0, 3).join(', ') + (item.skills.length > 3 ? ' + more' : '')
    : null;

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': {
          borderColor: accentColor,
          boxShadow: `0 0 0 1px ${alpha(accentColor, 0.2)}`,
        },
      }}
    >
      {/* ── Difficulty badge ── */}
      <Box
        sx={{
          position: 'absolute', top: 14, right: 14, zIndex: 1,
          display: 'flex', alignItems: 'center', gap: 0.6,
          px: 1.4, py: 0.45,
          bgcolor: badge.bg,
          border: '1px solid', borderColor: badge.border,
          borderRadius: 5,
        }}
      >
        <BarChartIcon sx={{ fontSize: 14, color: badge.color }} />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: badge.color, textTransform: 'capitalize', lineHeight: 1 }}
        >
          {item.difficulty || 'N/A'}
        </Typography>
      </Box>

      {/* ── Top section: image + content ── */}
      <Box sx={{ display: 'flex' }}>

        {/* Cover image */}
        <Box
          sx={{
            position: 'relative',
            width: { xs: 120, sm: 190 },
            flexShrink: 0,
            alignSelf: 'stretch',
            minHeight: 190,
            bgcolor: alpha(accentColor, 0.07),
            overflow: 'hidden',
          }}
        >
          {item.coverImage
            ? (
              <Box
                component="img"
                src={item.coverImage}
                alt={item.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DatabaseIcon sx={{ fontSize: 48, color: alpha(accentColor, 0.4) }} />
              </Box>
            )
          }

          {/* Top-left icon badge */}
          <Box
            sx={{
              position: 'absolute', top: 10, left: 10,
              width: 32, height: 32, borderRadius: 1.5,
              bgcolor: accentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
            }}
          >
            <DatabaseIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>

          {/* Bottom gradient overlay */}
          <Box
            sx={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              px: 1.5, py: 1,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.62rem', letterSpacing: 1.5, lineHeight: 1.35, textTransform: 'uppercase' }}>
              {item.title}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.58rem', letterSpacing: 1, textTransform: 'uppercase' }}>
              {item.dataType || 'Real-world Data'}
            </Typography>
          </Box>
        </Box>

        {/* Right: main content */}
        <Box sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3 }, pt: 2.5, pb: 2.5, pr: { sm: 7 } }}>

          {/* Card label */}
          <Typography
            variant="overline"
            sx={{ display: 'block', fontSize: '0.65rem', letterSpacing: 2, color: accentColor, mb: 0.25 }}
          >
            {cardLabel}
          </Typography>

          {/* Title */}
          <Typography variant="h5" fontWeight={700} lineHeight={1.2} mb={1.25}>
            {item.title}
          </Typography>

          {/* Meta: questions | estimatedTime */}
          <Stack direction="row" alignItems="center" gap={1.5} mb={1.5} flexWrap="wrap">
            {item.questions > 0 && (
              <Stack direction="row" alignItems="center" gap={0.6}>
                <QuestionsIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {item.questions} questions
                </Typography>
              </Stack>
            )}
            {item.questions > 0 && item.estimatedTime && (
              <Typography variant="body2" color="text.disabled">|</Typography>
            )}
            {item.estimatedTime && (
              <Stack direction="row" alignItems="center" gap={0.6}>
                <TimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {item.estimatedTime}
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2, lineHeight: 1.65,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {item.description}
          </Typography>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <Stack direction="row" gap={0.75} flexWrap="wrap">
              {item.tags.map((tag, i) => {
                const c = TAG_PALETTE[i % TAG_PALETTE.length];
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      height: 24, fontSize: '0.72rem', fontWeight: 500,
                      bgcolor: alpha(c, 0.12),
                      color: c,
                      border: `1px solid ${alpha(c, 0.25)}`,
                    }}
                  />
                );
              })}
            </Stack>
          )}

        </Box>
      </Box>

      {/* ── Divider ── */}
      <Divider />

      {/* ── Bottom stats row ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          gap: { xs: 1, md: 0 },
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
        }}
      >
        {item.tableCount > 0 && (
          <>
            <StatBlock
              icon={<DatabaseIcon sx={{ fontSize: 20, color: accentColor }} />}
              label={`${item.tableCount} Tables`}
              sub="Explore real schema"
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          </>
        )}

        {item.dataType && (
          <>
            <StatBlock
              icon={<BarChartIcon sx={{ fontSize: 20, color: accentColor }} />}
              label={item.dataType}
              sub="Based on actual data"
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          </>
        )}

        {modesText && (
          <>
            <StatBlock
              icon={<LayersIcon sx={{ fontSize: 20, color: accentColor }} />}
              label={modesText}
              sub="Multiple SQL modes"
            />
            {skillsPreview && <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />}
          </>
        )}

        {skillsPreview && (
          <StatBlock
            icon={<CodeIcon sx={{ fontSize: 20, color: accentColor }} />}
            label="Key Skills"
            sub={skillsPreview}
          />
        )}

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`${basePath}/${item.id}`)}
          sx={{
            ml: 'auto',
            flexShrink: 0,
            px: 3,
            bgcolor: accentColor,
            '&:hover': { bgcolor: alpha(accentColor, 0.85) },
          }}
        >
          {ctaLabel}
        </Button>
      </Box>
    </Card>
  );
}

// ─── Skeleton card ───────────────────────────────────────────────────────────

function DatasetCardSkeleton() {
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex' }}>
        <Skeleton variant="rectangular" width={190} height={195} sx={{ flexShrink: 0 }} />
        <Box sx={{ flex: 1, px: 3, pt: 2.5, pb: 2.5 }}>
          <Skeleton variant="text" width="10%" height={12} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="52%" height={34} sx={{ mb: 1.25 }} />
          <Skeleton variant="text" width="36%" height={16} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" width="100%" height={14} />
          <Skeleton variant="text" width="78%" height={14} sx={{ mb: 2 }} />
          <Stack direction="row" gap={0.75}>
            <Skeleton variant="rounded" width={85} height={24} />
            <Skeleton variant="rounded" width={65} height={24} />
            <Skeleton variant="rounded" width={95} height={24} />
          </Stack>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.25 }}>
        <Box sx={{ px: 2 }}><Skeleton variant="rounded" width={90} height={38} /></Box>
        <Box sx={{ px: 2 }}><Skeleton variant="rounded" width={110} height={38} /></Box>
        <Box sx={{ px: 2 }}><Skeleton variant="rounded" width={120} height={38} /></Box>
        <Box sx={{ px: 2 }}><Skeleton variant="rounded" width={90} height={38} /></Box>
        <Box sx={{ ml: 'auto', px: 2 }}><Skeleton variant="rounded" width={148} height={40} /></Box>
      </Box>
    </Card>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DatasetGrid({
  fetchFn,
  basePath,
  accentColor,
  title,
  titleHighlight,
  subtitle,
  badge,
  features = [],
  heroImage,
  cardLabel = 'Dataset',
  ctaLabel = 'Start Learning',
  searchPlaceholder = 'Search datasets...',
  itemsPerPage = 6,
}) {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items,            setItems]            = useState([]);
  const [totalItems,       setTotalItems]       = useState(0);
  const [loading,          setLoading]          = useState(true);
  const [levelFilter,      setLevelFilter]      = useState('All Levels');
  const [difficultyLevels, setDifficultyLevels] = useState(DEFAULT_DIFFICULTY_LEVELS);
  const [difficultyColor,  setDifficultyColor]  = useState(DEFAULT_DIFFICULTY_COLOR);
  const pageFromUrl   = Number(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchDatasetGridConfig().then((res) => {
      if (res.success) {
        if (res.data.difficultyLevels) setDifficultyLevels(['All Levels', ...res.data.difficultyLevels]);
        if (res.data.difficultyColor)  setDifficultyColor(res.data.difficultyColor);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchFn({ page: currentPage - 1, size: itemsPerPage, search }).then((res) => {
      if (res.success) {
        setItems(res.data.items || []);
        setTotalItems(res.data.totalElements || 0);
      }
      setLoading(false);
    });
  }, [currentPage, search, fetchFn]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
    setSearchParams({ page, search });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      setSearchParams({ page: 1, search: searchInput });
    }
  };

  const visibleItems = levelFilter === 'All Levels'
    ? items
    : items.filter((i) => i.difficulty?.toLowerCase() === levelFilter.toLowerCase());

  return (
    <Box sx={{ minHeight: '100%' }}>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: theme.palette.mode === 'dark' ? '#0d1117' : '#0f172a',
          color: '#fff',
          overflow: 'hidden',
          py: { xs: 5, md: 7 },
          px: { xs: 3, sm: 4 },
        }}
      >
        {/* Subtle accent glow behind content */}
        <Box
          sx={{
            position: 'absolute', top: -80, right: -80,
            width: 400, height: 400, borderRadius: '50%',
            bgcolor: alpha(accentColor, 0.08),
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" gap={4}>

            {/* Left: text */}
            <Box flex={1} position="relative">

              {/* Badge pill */}
              {badge && (
                <Box
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    border: '1px solid', borderColor: alpha(accentColor, 0.5),
                    bgcolor: alpha(accentColor, 0.1),
                    borderRadius: 10, px: 2, py: 0.5, mb: 2.5,
                  }}
                >
                  <DatabaseIcon sx={{ fontSize: 14, color: accentColor }} />
                  <Typography variant="caption" fontWeight={700} sx={{ color: accentColor, letterSpacing: 1.5 }}>
                    {badge}
                  </Typography>
                </Box>
              )}

              {/* Heading */}
              <Typography variant="h3" fontWeight={800} lineHeight={1.15} mb={1.5}>
                {title}{' '}
                {titleHighlight && (
                  <Box component="span" sx={{ color: accentColor }}>
                    {titleHighlight}
                  </Box>
                )}
              </Typography>

              {/* Subtitle */}
              {subtitle && (
                <Typography variant="body1" sx={{ color: alpha('#fff', 0.65), mb: 3.5 }}>
                  {subtitle}
                </Typography>
              )}

              {/* Feature points */}
              {features.length > 0 && (
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} flexWrap="wrap">
                  {features.map((f, i) => (
                    <Stack key={i} direction="row" alignItems="flex-start" gap={1.5}>
                      <Box
                        sx={{
                          p: 0.9, borderRadius: '50%',
                          bgcolor: alpha('#fff', 0.08),
                          display: 'flex', flexShrink: 0,
                        }}
                      >
                        {f.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="#fff">
                          {f.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.5) }}>
                          {f.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Right: hero image */}
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: '100%', md: 400 },
                height: { xs: 160, md: 230 },
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px dashed',
                borderColor: alpha(accentColor, 0.25),
                bgcolor: alpha(accentColor, 0.05),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {heroImage
                ? <Box component="img" src={heroImage} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <Typography variant="caption" sx={{ color: alpha('#fff', 0.25) }}>Hero image</Typography>
              }
            </Box>

          </Stack>
        </Container>
      </Box>

      {/* ── Dataset list ─────────────────────────────────────────────────── */}
      <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>

          {/* Section header + controls */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            gap={2}
            mb={3}
          >
            <Typography variant="h5" fontWeight={700}>
              Available Datasets
            </Typography>

            <Stack direction="row" gap={1.5} flexWrap="wrap">
              <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 240,
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: accentColor,
                  },
                }}
              />
              <Select
                size="small"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                sx={{
                  minWidth: 130,
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: accentColor },
                }}
              >
                {difficultyLevels.map((l) => (
                  <MenuItem key={l} value={l}>{l}</MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

          {/* Cards */}
          <Stack gap={2} mb={4}>
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, i) => <DatasetCardSkeleton key={i} />)
              : visibleItems.map((item) => (
                  <DatasetCard
                    key={item.id}
                    item={item}
                    basePath={basePath}
                    ctaLabel={ctaLabel}
                    cardLabel={cardLabel}
                    accentColor={accentColor}
                    difficultyColor={difficultyColor}
                  />
                ))
            }
          </Stack>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
              </Typography>
              <MuiPagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: accentColor,
                    borderColor: alpha(accentColor, 0.4),
                    '&.Mui-selected': {
                      bgcolor: accentColor,
                      color: '#fff',
                      borderColor: accentColor,
                      '&:hover': { bgcolor: alpha(accentColor, 0.85) },
                    },
                    '&:hover': { bgcolor: alpha(accentColor, 0.08) },
                  },
                }}
              />
            </Stack>
          )}

        </Container>
      </Box>
    </Box>
  );
}
