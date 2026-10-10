import {
  Box, Typography, Button, Card, Chip, Container, Stack, alpha, useTheme,
} from '@mui/material';
import SqlIcon from '@mui/icons-material/StorageOutlined';
import NoSqlIcon from '@mui/icons-material/AccountTreeOutlined';
import VectorIcon from '@mui/icons-material/ScatterPlotOutlined';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';
import LockIcon from '@mui/icons-material/LockOutlined';
import CheckIcon from '@mui/icons-material/CheckCircleRounded';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import SchemaIcon from '@mui/icons-material/AccountTreeOutlined';
import RunIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ── Content ──────────────────────────────────────────────────────────────────

const MODULES = [
  {
    title: 'SQL',
    description: 'Write real queries against real datasets. Joins, aggregates, window functions and CTEs, judged against hidden test cases.',
    icon: SqlIcon,
    tone: 'primary',
    link: '/sql',
    moduleKey: 'SQL',
    topics: ['JOIN', 'GROUP BY', 'Window functions'],
  },
  {
    title: 'NoSQL',
    description: 'Model documents and key-value data, then query them with aggregation pipelines and indexes.',
    icon: NoSqlIcon,
    tone: 'success',
    link: '/nosql',
    moduleKey: 'NOSQL',
    topics: ['Documents', 'Pipelines', 'Indexes'],
  },
  {
    title: 'Vector DB',
    description: 'Store embeddings and run similarity search with metadata filters and approximate nearest neighbours.',
    icon: VectorIcon,
    tone: 'info',
    link: '/vectordb',
    moduleKey: 'VECTORDB',
    topics: ['Embeddings', 'ANN search', 'Filters'],
  },
];

const STEPS = [
  { icon: DatasetIcon, title: 'Pick a dataset', body: 'Choose from real-world data like e-commerce orders, flights or hospital records. Each one is loaded into a live session for you.' },
  { icon: SchemaIcon,  title: 'Explore the schema', body: 'See every table, column, type and key before you write a line, with sample rows for each problem.' },
  { icon: RunIcon,     title: 'Run, then submit', body: 'Run your query to check the output, then submit to be judged on hidden test cases in MySQL or PostgreSQL.' },
];

const HIGHLIGHTS = ['MySQL & PostgreSQL', 'Real-world datasets', 'Instant feedback'];

const SAMPLE_SQL = [
  ['kw', 'SELECT'], ['', ' c.name, '], ['fn', 'SUM'], ['', '(o.amount) '], ['kw', 'AS'], ['', ' total\n'],
  ['kw', 'FROM'], ['', ' orders o\n'],
  ['kw', 'JOIN'], ['', ' customers c '], ['kw', 'ON'], ['', ' c.id = o.customer_id\n'],
  ['kw', 'WHERE'], ['', ' o.status = '], ['str', "'paid'"], ['', '\n'],
  ['kw', 'GROUP BY'], ['', ' c.name\n'],
  ['kw', 'ORDER BY'], ['', ' total '], ['kw', 'DESC'], ['', '\n'],
  ['kw', 'LIMIT'], ['', ' '], ['num', '5'], ['', ';'],
];

const SAMPLE_ROWS = [['Asha Rao', '1,284.50'], ['Leo Park', '1,102.00'], ['Mia Chen', '987.25']];

// ── Pieces ───────────────────────────────────────────────────────────────────

function SectionHeading({ eyebrow, title, sub }) {
  return (
    <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: 640 }}>
      <Typography
        component="p"
        sx={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'primary.main', mb: 1 }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h2" component="h2" sx={{ fontSize: { xs: '1.625rem', md: '2rem' }, textWrap: 'balance' }}>
        {title}
      </Typography>
      {sub && (
        <Typography sx={{ mt: 1, fontSize: '1rem', lineHeight: 1.65, color: 'text.secondary' }}>
          {sub}
        </Typography>
      )}
    </Box>
  );
}

function CodePreview() {
  const theme = useTheme();
  const c = theme.palette.code;
  const mono = theme.typography.fontFamilyMono;
  const colorOf = { kw: c.keyword, fn: c.func, str: c.string, num: c.number, '': c.text };

  return (
    <Box
      sx={{
        width: '100%', maxWidth: 620, mx: 'auto', textAlign: 'left',
        borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        bgcolor: c.bg, boxShadow: theme.customShadows.raised,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.75} sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.subtle' }}>
        {[0, 1, 2].map((i) => <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'border' }} />)}
        <Typography sx={{ ml: 1, fontFamily: mono, fontSize: '0.8125rem', color: 'text.secondary' }}>top_customers.sql</Typography>
        <Box sx={{ flex: 1 }} />
        <Chip size="small" color="success" icon={<CheckIcon />} label="Accepted · 8/8" sx={{ fontSize: '0.75rem' }} />
      </Stack>

      <Box
        component="pre"
        aria-label="Example SQL query"
        sx={{
          m: 0, px: 2.5, py: 2,
          fontFamily: mono, fontSize: { xs: '0.8125rem', sm: '0.9375rem' }, lineHeight: 1.75,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}
      >
        {SAMPLE_SQL.map(([k, t], i) => (
          <Box component="span" key={i} sx={{ color: colorOf[k], fontWeight: k === 'kw' ? 600 : 400 }}>{t}</Box>
        ))}
      </Box>

      {/* Result strip */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.subtle', px: 2.5, py: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'text.secondary' }}>
            Result
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
            5 rows · 38 ms
          </Typography>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 0.5, columnGap: 3, fontFamily: mono, fontSize: '0.8125rem' }}>
          {SAMPLE_ROWS.map(([n, t]) => (
            <Box key={n} sx={{ display: 'contents' }}>
              <Box component="span" sx={{ color: 'text.primary' }}>{n}</Box>
              <Box component="span" sx={{ color: 'text.primary', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ModuleCard({ card, locked, lockedLabel, onOpen }) {
  const theme  = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const tone   = theme.palette[card.tone];
  const Icon   = card.icon;
  const accentText = isDark ? tone.light : tone.dark;

  return (
    <Card
      component={locked ? 'div' : 'button'}
      type={locked ? undefined : 'button'}
      onClick={locked ? undefined : onOpen}
      aria-disabled={locked || undefined}
      sx={{
        p: 0, textAlign: 'left', font: 'inherit', color: 'inherit', width: '100%',
        display: 'flex', flexDirection: 'column',
        cursor: locked ? 'default' : 'pointer',
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
        '&:hover': locked ? {} : {
          transform: 'translateY(-3px)',
          boxShadow: theme.customShadows.raised,
          borderColor: alpha(tone.main, 0.5),
        },
        '&:hover .module-cta svg': { transform: 'translateX(3px)' },
        '&:focus-visible': { outline: 'none', boxShadow: theme.customShadows.primary },
      }}
    >
      {/* Art band: tinted, dotted, with the module icon. No external images. */}
      <Box
        sx={{
          position: 'relative', height: { xs: 96, md: 120 }, flexShrink: 0,
          bgcolor: alpha(tone.main, isDark ? 0.14 : 0.08),
          backgroundImage: `radial-gradient(${alpha(tone.main, isDark ? 0.35 : 0.25)} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          borderBottom: '1px solid', borderColor: 'divider',
          filter: locked ? 'grayscale(0.85)' : 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute', left: 20, bottom: -24,
            width: 52, height: 52, borderRadius: 3,
            display: 'grid', placeItems: 'center',
            bgcolor: locked ? 'background.subtle' : tone.main,
            color: locked ? 'text.secondary' : tone.contrastText,
            border: '3px solid', borderColor: 'background.paper',
            boxShadow: theme.customShadows.card,
          }}
        >
          <Icon sx={{ fontSize: 26 }} />
        </Box>
        {locked && (
          <Chip
            icon={<LockIcon />}
            label={lockedLabel}
            size="small"
            sx={{
              position: 'absolute', top: 14, right: 14,
              bgcolor: 'background.paper', color: 'text.primary', fontSize: '0.75rem',
              border: '1px solid', borderColor: 'divider',
              '& .MuiChip-icon': { fontSize: 14, color: 'text.secondary' },
            }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5, pt: 4.5, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
        <Typography variant="h3" component="h3" sx={{ fontSize: '1.375rem' }}>
          {card.title}
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'text.secondary' }}>
          {card.description}
        </Typography>
        <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 0.5 }}>
          {card.topics.map((t) => (
            <Box
              key={t}
              component="span"
              sx={{
                fontSize: '0.75rem', fontWeight: 600, px: 1, py: 0.25, borderRadius: 1.5,
                bgcolor: 'background.subtle', color: 'text.secondary', border: '1px solid', borderColor: 'divider',
              }}
            >
              {t}
            </Box>
          ))}
        </Stack>
        <Box sx={{ flex: 1 }} />
        <Stack
          className="module-cta"
          direction="row"
          alignItems="center"
          gap={0.5}
          sx={{
            mt: 1, fontWeight: 700, fontSize: '0.9375rem',
            color: locked ? 'text.secondary' : accentText,
            '& svg': { transition: 'transform .2s' },
          }}
        >
          {locked ? (
            <>
              <LockIcon sx={{ fontSize: 16 }} />
              {lockedLabel === 'Coming soon' ? 'Coming soon' : 'Not enabled for your account'}
            </>
          ) : (
            <>Open {card.title} <ArrowIcon sx={{ fontSize: 18 }} /></>
          )}
        </Stack>
      </Box>
    </Card>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Landing() {
  const theme    = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const user     = useSelector((s) => s.auth.user);
  const modules  = useSelector((s) => s.config.data?.modules);
  const isDark   = theme.palette.mode === 'dark';

  // SQL is always open; other modules follow the user's config (locked when unknown)
  const isLocked = (card) => card.moduleKey !== 'SQL' && !modules?.find((m) => m.key === card.moduleKey)?.enabled;
  const lockedLabel = isAuthenticated ? 'Locked' : 'Coming soon';
  const firstName = user?.firstName || user?.name?.split(' ')[0];

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow + faint grid behind the hero */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(60% 40% at 50% 0%, ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08)} 0%, transparent 70%)`,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 760, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.045)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.045)} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 80%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 } }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <Stack component="section" alignItems="center" textAlign="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 1.75, py: 0.75, mb: 3, borderRadius: 999,
              border: '1px solid', borderColor: alpha(theme.palette.primary.main, isDark ? 0.45 : 0.25),
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.12) : 'background.paper',
              boxShadow: isDark ? 'none' : theme.customShadows.z1,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}` }} />
            <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
              {isAuthenticated && firstName ? `Welcome back, ${firstName}` : 'Learn SQL on real-world datasets'}
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.25rem', md: '4.25rem' },
              lineHeight: 1.04,
              letterSpacing: '-0.04em',
              maxWidth: 860,
              textWrap: 'balance',
            }}
          >
            Brew better queries with{' '}
            <Box
              component="span"
              sx={isDark ? {
                background: 'linear-gradient(100deg, #F2546B 10%, #F5A9B3 90%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              } : { color: 'primary.main' }}
            >
              BrewQuery
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 3, maxWidth: 620, color: 'text.secondary',
              fontSize: { xs: '1.0625rem', md: '1.1875rem' }, lineHeight: 1.65,
            }}
          >
            Pick a dataset, explore its schema, and solve challenges written against the actual data.
            Every query runs live and is judged on hidden test cases.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="center" sx={{ mt: 4, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/sql')}
              sx={{ px: 3.5, py: 1.4, fontSize: '1rem', boxShadow: theme.customShadows.primaryButton }}
            >
              {isAuthenticated ? 'Continue practising' : 'Start practising'}
            </Button>
            {isAuthenticated ? (
              <Button
                variant="outlined" color="inherit" size="large"
                sx={{ px: 3.5, py: 1.4, fontSize: '1rem', bgcolor: 'background.paper' }}
                onClick={() => navigate(`/master/${user?.userId ?? ''}`)}
              >
                View your progress
              </Button>
            ) : (
              <Button
                variant="outlined" color="inherit" size="large"
                sx={{ px: 3.5, py: 1.4, fontSize: '1rem', bgcolor: 'background.paper' }}
                onClick={() => navigate('/login')}
              >
                Create a free account
              </Button>
            )}
          </Stack>

          <Stack
            direction="row" flexWrap="wrap" justifyContent="center" useFlexGap
            sx={{ mt: 3, columnGap: 3, rowGap: 1 }}
          >
            {HIGHLIGHTS.map((h) => (
              <Stack key={h} direction="row" alignItems="center" gap={0.75}>
                <CheckIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 500, color: 'text.secondary' }}>{h}</Typography>
              </Stack>
            ))}
          </Stack>

          <Box sx={{ width: '100%', mt: { xs: 5, md: 7 } }}>
            <CodePreview />
          </Box>
        </Stack>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <Box component="section" sx={{ mb: { xs: 8, md: 12 } }}>
          <SectionHeading
            eyebrow="How it works"
            title="From dataset to accepted in three steps"
            sub="Problems are grouped by dataset, so you learn one schema well instead of jumping between toy tables."
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box
                      sx={{
                        width: 44, height: 44, borderRadius: 2.5, display: 'grid', placeItems: 'center',
                        bgcolor: 'primary.lighter', color: isDark ? 'primary.light' : 'primary.main',
                      }}
                    >
                      <Icon sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                      Step {i + 1}
                    </Typography>
                  </Stack>
                  <Typography variant="h3" component="h3" sx={{ fontSize: '1.25rem', mt: 0.5 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'text.secondary' }}>
                    {s.body}
                  </Typography>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* ── Modules ──────────────────────────────────────────────────── */}
        <Box component="section">
          <SectionHeading
            eyebrow="Modules"
            title="Choose what to practise"
            sub="SQL is open to everyone. NoSQL and vector databases are on the way."
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {MODULES.map((card) => (
              <ModuleCard
                key={card.title}
                card={card}
                locked={isLocked(card)}
                lockedLabel={lockedLabel}
                onOpen={() => navigate(card.link)}
              />
            ))}
          </Box>
        </Box>
      </Container>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'relative' }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}
            gap={1} sx={{ py: 3 }}
          >
            <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              © {new Date().getFullYear()} BrewQuery. A playground for learning databases.
            </Typography>
            <Button size="small" color="inherit" endIcon={<ArrowIcon />} onClick={() => navigate('/sql')} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
              Browse SQL datasets
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
