import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Card, Typography, Stack, Container, IconButton, InputBase,
  Pagination as MuiPagination, Skeleton, ToggleButton, ToggleButtonGroup,
  Button, Tooltip, alpha, lighten, useTheme,
} from '@mui/material';
import DatabaseIcon from '@mui/icons-material/StorageOutlined';
import SearchIcon from '@mui/icons-material/SearchRounded';
import ClearIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardRounded';
import QuestionsIcon from '@mui/icons-material/ListAltOutlined';
import TimeIcon from '@mui/icons-material/AccessTimeOutlined';
import TableIcon from '@mui/icons-material/TableChartOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOffRounded';
import LayersIcon from '@mui/icons-material/LayersOutlined';
import { fetchDatasetGridConfig, fetchPageConfig } from '../../api/configApi';
import { difficultyColor as diffColorOf } from '../../theme/palette';

// Fallback until the config API responds
const DEFAULT_DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Advanced'];
const ALL = 'all';

// The hero band is always dark (both themes), so its colours are fixed warm-ink tones
const HERO = {
  bg:    '#161213',
  text:  '#F2ECEC',
  muted: '#B8ADB0',
  faint: 'rgba(242,236,236,0.08)',
  line:  'rgba(242,236,236,0.12)',
};

const MODE_LABELS = { mysql: 'MySQL', postgresql: 'PostgreSQL', sqlite: 'SQLite', mssql: 'SQL Server' };
const SEARCH_DEBOUNCE_MS = 350;

// ─── Small pieces ────────────────────────────────────────────────────────────

function DifficultyPill({ value, solid = false }) {
  const theme = useTheme();
  const color = diffColorOf(theme, value);
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75, flexShrink: 0,
        px: 1.25, py: 0.4, borderRadius: 999,
        fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.3, textTransform: 'capitalize',
        color, bgcolor: solid ? 'background.paper' : alpha(color, theme.palette.mode === 'dark' ? 0.16 : 0.1),
        boxShadow: solid ? '0 1px 3px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <Box component="span" sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }} />
      {value || 'All levels'}
    </Box>
  );
}

function Meta({ icon, children }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ color: 'text.secondary', minWidth: 0 }}>
      {icon}
      <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
        {children}
      </Typography>
    </Stack>
  );
}

// ─── Dataset cover (image or generated placeholder) ──────────────────────────

// Fixed art colours (look right in both themes). Each dataset gets one, picked from its title.
const COVER_TONES = [
  ['#B3324A', '#3A0A13'], // garnet
  ['#B45309', '#3B1603'], // amber
  ['#0E7490', '#082F3A'], // teal
  ['#4F46E5', '#1E1B4B'], // indigo
  ['#15803D', '#052E16'], // green
  ['#A21CAF', '#3B0764'], // plum
];
const hashOf = (str = '') => [...String(str)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// A small "schema" drawing: three tables joined by lines
function SchemaArt({ seed }) {
  const flip = seed % 2 === 1;
  const t = (x, y, rows, w = 92) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={18 + rows * 12} rx="7" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)" />
      <rect width={w} height="16" rx="7" fill="rgba(255,255,255,0.32)" />
      {Array.from({ length: rows }).map((_, i) => (
        <rect key={i} x="9" y={23 + i * 12} width={w - 18 - ((i * 17 + seed) % 28)} height="4" rx="2" fill="rgba(255,255,255,0.45)" />
      ))}
    </g>
  );
  return (
    <Box
      component="svg" viewBox="0 0 360 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: flip ? 'scaleX(-1)' : 'none' }}
    >
      <path d="M150 52 C 185 52, 185 40, 214 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
      <path d="M150 70 C 190 70, 190 104, 226 104" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
      {t(58, 34, 4)}
      {t(214, 20, 2, 84)}
      {t(226, 84, 3, 96)}
    </Box>
  );
}

function DatasetCover({ item, difficulty }) {
  const [failed, setFailed] = useState(false);
  const seed = hashOf(`${item.id}-${item.title}`);
  // Numeric ids give neighbouring cards different colours; anything else falls back to the hash
  const toneIndex = Number.isFinite(Number(item.id)) ? Number(item.id) : seed;
  const [from, to] = COVER_TONES[Math.abs(toneIndex) % COVER_TONES.length];
  const showImage = item.coverImage && !failed;

  return (
    <Box
      sx={{
        position: 'relative', height: 148, flexShrink: 0, overflow: 'hidden',
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        borderBottom: '1px solid', borderColor: 'divider',
      }}
    >
      {showImage ? (
        <Box
          component="img" src={item.coverImage} alt="" loading="lazy"
          onError={() => setFailed(true)}
          className="dataset-cover"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .4s ease' }}
        />
      ) : (
        <>
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
          <SchemaArt seed={seed} />
        </>
      )}
      {/* Readability scrim for the badges */}
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 45%)' }} />
      <Box sx={{ position: 'absolute', top: 12, left: 12 }}>{difficulty}</Box>
      {item.dataType && !/^(sql|nosql|vector)/i.test(item.dataType) && (
        <Box
          sx={{
            position: 'absolute', top: 12, right: 12,
            px: 1, py: 0.35, borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 700,
            color: '#FFFFFF', bgcolor: 'rgba(18,16,18,0.55)', backdropFilter: 'blur(4px)',
          }}
        >
          {item.dataType}
        </Box>
      )}
    </Box>
  );
}

// ─── Dataset card ────────────────────────────────────────────────────────────

function DatasetCard({ item, basePath, ctaLabel, accentColor }) {
  const navigate = useNavigate();
  const theme    = useTheme();
  const isDark   = theme.palette.mode === 'dark';
  const open     = () => navigate(`${basePath}/${item.id}`);
  const modes    = item.sqlModesAvailable?.map((m) => MODE_LABELS[m] || m) ?? [];
  const skills   = item.skills ?? [];
  const shownSkills = skills.slice(0, 3);
  const ctaColor = isDark ? lighten(accentColor, 0.35) : accentColor;

  return (
    <Card
      component="article"
      sx={{
        position: 'relative', height: '100%',
        display: 'flex', flexDirection: 'column',
        transition: 'border-color .2s, box-shadow .2s, transform .2s',
        '&:hover': {
          borderColor: alpha(accentColor, 0.5),
          boxShadow: theme.customShadows.raised,
          transform: 'translateY(-3px)',
        },
        '&:hover .dataset-cover': { transform: 'scale(1.04)' },
        '&:hover .dataset-cta': { bgcolor: accentColor, color: theme.palette.primary.contrastText, borderColor: accentColor },
        '&:hover .dataset-cta svg': { transform: 'translateX(3px)' },
      }}
    >
      <DatasetCover item={item} difficulty={<DifficultyPill value={item.difficulty} solid />} />

      <Box sx={{ p: { xs: 2.25, sm: 2.75 }, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
        {/* Title — the real link; its ::after stretches over the whole card */}
        <Box>
          <Typography variant="h3" component="h3" sx={{ fontSize: { xs: '1.1875rem', sm: '1.3125rem' }, lineHeight: 1.3 }}>
            <Box
              component="a"
              href={`${basePath}/${item.id}`}
              onClick={(e) => { e.preventDefault(); open(); }}
              sx={{
                color: 'inherit', textDecoration: 'none',
                '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit' },
                '&:focus-visible': { outline: 'none' },
                '&:focus-visible::after': { boxShadow: theme.customShadows.primary },
              }}
            >
              {item.title}
            </Box>
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ mt: 0.75, columnGap: 2, rowGap: 0.5 }}>
            {item.questions > 0 && <Meta icon={<QuestionsIcon sx={{ fontSize: 17 }} />}>{item.questions} problems</Meta>}
            {item.tableCount > 0 && <Meta icon={<TableIcon sx={{ fontSize: 17 }} />}>{item.tableCount} tables</Meta>}
            {item.estimatedTime && <Meta icon={<TimeIcon sx={{ fontSize: 17 }} />}>{item.estimatedTime}</Meta>}
            {modes.length > 0 && <Meta icon={<LayersIcon sx={{ fontSize: 17 }} />}>{modes.join(' · ')}</Meta>}
          </Stack>
        </Box>

        {/* Description: two lines so every card lines up */}
        <Typography
          sx={{
            fontSize: '0.9375rem', lineHeight: 1.6, color: 'text.secondary', minHeight: '3.2em',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {item.description || 'No description yet.'}
        </Typography>

        {/* Skills */}
        {shownSkills.length > 0 && (
          <Stack direction="row" gap={0.75} alignItems="center" sx={{ overflow: 'hidden', flexWrap: 'nowrap', minHeight: 28 }}>
            {shownSkills.map((s) => (
              <Box
                key={s}
                component="span"
                sx={{
                  fontFamily: theme.typography.fontFamilyMono, fontSize: '0.8125rem', fontWeight: 500,
                  px: 1, py: 0.25, borderRadius: 1.5, whiteSpace: 'nowrap', flexShrink: 0,
                  bgcolor: 'background.subtle', color: 'text.primary', border: '1px solid', borderColor: 'divider',
                }}
              >
                {s}
              </Box>
            ))}
            {skills.length > shownSkills.length && (
              <Tooltip title={skills.slice(shownSkills.length).join(', ')}>
                <Box component="span" sx={{ position: 'relative', zIndex: 1, fontSize: '0.8125rem', fontWeight: 600, px: 0.5, color: 'text.secondary', cursor: 'default', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  +{skills.length - shownSkills.length} more
                </Box>
              </Tooltip>
            )}
          </Stack>
        )}

        <Box sx={{ flex: 1 }} />

        {/* Footer: full-width action so every card ends the same way */}
        <Stack
          className="dataset-cta"
          direction="row" alignItems="center" justifyContent="center" gap={0.75}
          sx={{
            mt: 0.5, py: 1, borderRadius: 2,
            fontWeight: 700, fontSize: '0.9375rem',
            color: ctaColor, bgcolor: alpha(accentColor, isDark ? 0.16 : 0.07),
            border: '1px solid', borderColor: alpha(accentColor, isDark ? 0.4 : 0.2),
            transition: 'background-color .2s, color .2s, border-color .2s',
            '& svg': { transition: 'transform .2s' },
          }}
        >
          {ctaLabel} <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </Stack>
      </Box>
    </Card>
  );
}

function DatasetCardSkeleton() {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={148} />
      <Box sx={{ p: 2.75, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          <Skeleton variant="text" width="55%" height={30} />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Box>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
        <Stack direction="row" gap={0.75}>
          {[64, 80, 96].map((w) => <Skeleton key={w} variant="rounded" width={w} height={24} />)}
        </Stack>
        <Skeleton variant="rounded" height={40} sx={{ mt: 1 }} />
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
  pageKey,
  cardLabel = 'Dataset',
  ctaLabel = 'Open dataset',
  searchPlaceholder = 'Search datasets',
  itemsPerPage = 6,
}) {
  const theme = useTheme();
  // Module accent falls back to the brand colour. The hero is always dark, so it uses the dark-mode tone.
  const accent     = accentColor || theme.palette.primary.main;
  const heroAccent = accentColor ? lighten(accentColor, 0.35) : '#F2546B';
  const [searchParams, setSearchParams] = useSearchParams();

  const [items,            setItems]            = useState([]);
  const [totalItems,       setTotalItems]       = useState(0);
  const [level,            setLevel]            = useState(ALL);
  const [difficultyLevels, setDifficultyLevels] = useState(DEFAULT_DIFFICULTY_LEVELS);
  const [heroImage,        setHeroImage]        = useState(null);
  const currentPage = Number(searchParams.get('page')) || 1;
  const search      = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);
  const listTopRef = useRef(null);
  // "Loading" is derived: we're loading until the results for the current page+search have arrived
  const queryKey = `${currentPage}|${search}`;
  const [loadedKey, setLoadedKey] = useState(null);
  const loading = loadedKey !== queryKey;

  useEffect(() => {
    fetchDatasetGridConfig().then((res) => {
      if (res.success && Array.isArray(res.data?.difficultyLevels)) setDifficultyLevels(res.data.difficultyLevels);
    });
  }, []);

  useEffect(() => {
    if (!pageKey) return;
    fetchPageConfig(pageKey).then((res) => {
      if (res.success && res.data?.heroImageUrl) setHeroImage(res.data.heroImageUrl);
    });
  }, [pageKey]);

  useEffect(() => {
    let alive = true;
    fetchFn({ page: currentPage - 1, size: itemsPerPage, search }).then((res) => {
      if (!alive) return;
      if (res.success) {
        setItems(res.data?.items || []);
        setTotalItems(res.data?.totalElements || 0);
      }
      setLoadedKey(`${currentPage}|${search}`);
    });
    return () => { alive = false; };
  }, [currentPage, search, fetchFn, itemsPerPage]);

  // Apply the search as the user types (debounced), resetting to page 1
  useEffect(() => {
    if (searchInput === search) return undefined;
    const t = setTimeout(() => {
      const next = {};
      if (searchInput.trim()) next.search = searchInput.trim();
      setSearchParams(next, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, search, setSearchParams]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (_, page) => {
    const next = { page };
    if (search) next.search = search;
    setSearchParams(next);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const visibleItems = level === ALL
    ? items
    : items.filter((i) => String(i.difficulty || '').toLowerCase() === level.toLowerCase());

  const clearFilters = () => { setLevel(ALL); setSearchInput(''); setSearchParams({}); };
  const noun   = cardLabel.toLowerCase();
  const nouns  = /(x|s|ch|sh)$/.test(noun) ? `${noun}es` : `${noun}s`;

  return (
    <Box sx={{ minHeight: '100%' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        component="section"
        sx={{
          position: 'relative', overflow: 'hidden',
          bgcolor: HERO.bg, color: HERO.text,
          borderBottom: '1px solid', borderColor: 'divider',
          py: { xs: 4.5, md: 6 }, px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute', top: -140, right: -80, width: 520, height: 520, borderRadius: '50%',
            bgcolor: alpha(heroAccent, 0.22), filter: 'blur(110px)', pointerEvents: 'none',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.6,
            backgroundImage: `linear-gradient(${HERO.faint} 1px, transparent 1px), linear-gradient(90deg, ${HERO.faint} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 70%)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 70%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', px: { xs: 0, sm: 2 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={4}>
            <Box flex={1} minWidth={0}>
              {badge && (
                <Box
                  sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    border: '1px solid', borderColor: alpha(heroAccent, 0.45), bgcolor: alpha(heroAccent, 0.12),
                    borderRadius: 999, px: 1.5, py: 0.5, mb: 2,
                  }}
                >
                  <DatabaseIcon sx={{ fontSize: 16, color: heroAccent }} />
                  <Typography component="span" sx={{ fontSize: '0.8125rem', fontWeight: 700, color: heroAccent, letterSpacing: '0.06em' }}>
                    {badge}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="h1"
                component="h1"
                sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.1, color: HERO.text, textWrap: 'balance' }}
              >
                {title}{' '}
                {titleHighlight && <Box component="span" sx={{ color: heroAccent }}>{titleHighlight}</Box>}
              </Typography>

              {subtitle && (
                <Typography sx={{ color: HERO.muted, mt: 1.5, fontSize: { xs: '1rem', md: '1.0625rem' }, lineHeight: 1.65, maxWidth: 600 }}>
                  {subtitle}
                </Typography>
              )}

              {features.length > 0 && (
                <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ mt: 3, columnGap: 3.5, rowGap: 2 }}>
                  {features.map((f) => (
                    <Stack key={f.label} direction="row" alignItems="center" gap={1.25}>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'grid', placeItems: 'center', bgcolor: HERO.faint, border: `1px solid ${HERO.line}`, flexShrink: 0 }}>
                        {f.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: HERO.text, lineHeight: 1.3 }}>{f.label}</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', color: HERO.muted }}>{f.description}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>

            {heroImage && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' }, flexShrink: 0, width: 380, height: 220,
                  borderRadius: 3, overflow: 'hidden', border: `1px solid ${HERO.line}`,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
                }}
              >
                <Box component="img" src={heroImage} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </Box>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ── Dataset list ─────────────────────────────────────────────────── */}
      <Box ref={listTopRef} sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, sm: 3 }, scrollMarginTop: 64 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>

          {/* Header + controls */}
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" gap={2} mb={3}>
            <Box>
              <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                {search ? `Results for “${search}”` : `All ${nouns}`}
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: '0.9375rem', color: 'text.secondary' }}>
                {loading ? 'Loading…' : `${totalItems} ${totalItems === 1 ? noun : nouns}${search ? ' found' : ' to explore'}`}
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} alignItems={{ sm: 'center' }}>
              <ToggleButtonGroup
                exclusive size="small" value={level}
                onChange={(_, v) => v && setLevel(v)}
                aria-label="Filter by difficulty"
                sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, flexWrap: 'wrap' }}
              >
                <ToggleButton value={ALL} sx={{ px: 1.5, fontSize: '0.875rem' }}>All</ToggleButton>
                {difficultyLevels.map((l) => (
                  <ToggleButton key={l} value={l} sx={{ px: 1.5, fontSize: '0.875rem', textTransform: 'capitalize' }}>{l}</ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Box
                component="label"
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, pl: 1.5, pr: 0.5, height: 40,
                  width: { xs: '100%', sm: 280 },
                  border: '1px solid', borderColor: 'border', borderRadius: 2, bgcolor: 'background.paper',
                  transition: 'border-color .15s, box-shadow .15s',
                  '&:focus-within': { borderColor: 'primary.main', boxShadow: theme.customShadows.primary },
                }}
              >
                <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <InputBase
                  placeholder={searchPlaceholder}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  inputProps={{ 'aria-label': searchPlaceholder }}
                  sx={{ flex: 1, fontSize: '0.9375rem' }}
                />
                {searchInput && (
                  <IconButton size="small" aria-label="Clear search" onClick={() => setSearchInput('')}>
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Stack>

          {/* Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5, mb: 4 }}>
            {loading
              ? Array.from({ length: Math.min(itemsPerPage, 4) }).map((_, i) => <DatasetCardSkeleton key={i} />)
              : visibleItems.map((item) => (
                  <DatasetCard key={item.id} item={item} basePath={basePath} ctaLabel={ctaLabel} accentColor={accent} />
                ))}
          </Box>

          {/* Empty state */}
          {!loading && visibleItems.length === 0 && (
            <Stack alignItems="center" textAlign="center" gap={1.25} sx={{ py: 8, px: 2, border: '1px dashed', borderColor: 'border', borderRadius: 3, mb: 4 }}>
              <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              <Typography variant="h4" component="p">No {nouns} match</Typography>
              <Typography sx={{ fontSize: '0.9375rem', color: 'text.secondary', maxWidth: 420 }}>
                {items.length > 0
                  ? `None of the ${nouns} on this page have that difficulty. Try another level or clear the filters.`
                  : 'Try a different search term, or clear the filters to see everything.'}
              </Typography>
              <Button variant="outlined" color="inherit" onClick={clearFilters} sx={{ mt: 1 }}>Clear filters</Button>
            </Stack>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack alignItems="center" spacing={1.25}>
              <MuiPagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" shape="rounded" />
              <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
              </Typography>
            </Stack>
          )}

        </Container>
      </Box>
    </Box>
  );
}
