import {
  Box, Typography, Button, Card, CardMedia, CardContent,
  Chip, Container, Stack, alpha, useTheme,
} from '@mui/material';
import SqlIcon from '@mui/icons-material/StorageOutlined';
import NoSqlIcon from '@mui/icons-material/AccountTreeOutlined';
import VectorIcon from '@mui/icons-material/ScatterPlotOutlined';
import ArrowIcon from '@mui/icons-material/ArrowForwardRounded';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CARDS = [
  {
    title: 'SQL',
    description: 'Write real queries against real datasets. Joins, aggregates, window functions and CTEs, judged against hidden test cases.',
    icon: SqlIcon,
    tone: 'primary',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    link: '/sql',
    moduleKey: 'SQL',
  },
  {
    title: 'NoSQL',
    description: 'Model documents and key-value data, then query them with aggregation pipelines and indexes.',
    icon: NoSqlIcon,
    tone: 'success',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60',
    link: '/nosql',
    moduleKey: 'NOSQL',
  },
  {
    title: 'Vector DB',
    description: 'Store embeddings and run similarity search with metadata filters and approximate nearest neighbours.',
    icon: VectorIcon,
    tone: 'info',
    image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&w=800&q=60',
    link: '/vectordb',
    moduleKey: 'VECTORDB',
  },
];

const SAMPLE_SQL = [
  ['kw', 'SELECT'], ['', ' c.name, '], ['fn', 'SUM'], ['', '(o.amount) '], ['kw', 'AS'], ['', ' total\n'],
  ['kw', 'FROM'], ['', ' orders o '], ['kw', 'JOIN'], ['', ' customers c '], ['kw', 'ON'], ['', ' c.id = o.customer_id\n'],
  ['kw', 'WHERE'], ['', ' o.status = '], ['str', "'paid'"], ['', '\n'],
  ['kw', 'GROUP BY'], ['', ' c.name '], ['kw', 'ORDER BY'], ['', ' total '], ['kw', 'DESC'], ['', '\n'],
  ['kw', 'LIMIT'], ['', ' '], ['num', '5'], ['', ';'],
];

function CodePreview() {
  const theme = useTheme();
  const c = theme.palette.code;
  const colorOf = { kw: c.keyword, fn: c.func, str: c.string, num: c.number, '': c.text };
  return (
    <Box
      sx={{
        width: '100%', maxWidth: 560, mx: 'auto', textAlign: 'left',
        borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider',
        bgcolor: c.bg, boxShadow: theme.customShadows.raised,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.75} sx={{ px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.subtle' }}>
        {[0, 1, 2].map((i) => <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'border' }} />)}
        <Typography variant="caption" sx={{ ml: 1, fontFamily: theme.typography.fontFamilyMono, color: 'text.secondary' }}>top_customers.sql</Typography>
        <Box sx={{ flex: 1 }} />
        <Chip size="small" color="success" label="Accepted · 8/8" />
      </Stack>
      <Box component="pre" sx={{ m: 0, p: 2, fontFamily: theme.typography.fontFamilyMono, fontSize: '0.8125rem', lineHeight: 1.75, overflowX: 'auto' }}>
        {SAMPLE_SQL.map(([k, t], i) => (
          <Box component="span" key={i} sx={{ color: colorOf[k], fontWeight: k === 'kw' ? 600 : 400 }}>{t}</Box>
        ))}
      </Box>
    </Box>
  );
}

export default function Landing() {
  const theme    = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const modules  = useSelector((s) => s.config.data?.modules);
  const isDark   = theme.palette.mode === 'dark';

  // SQL is always open; other modules follow the user's config (locked when unknown)
  const isLocked = (card) => card.moduleKey !== 'SQL' && !modules?.find((m) => m.key === card.moduleKey)?.enabled;

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow + faint grid */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(60% 50% at 50% 0%, ${alpha(theme.palette.primary.main, isDark ? 0.18 : 0.1)} 0%, transparent 70%)`,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.04)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.04)} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 6, md: 10 }, pb: 8 }}>
        {/* Hero */}
        <Stack alignItems="center" textAlign="center" spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
          <Chip
            label="Learn SQL on real-world datasets"
            size="small"
            color="primary"
            sx={{ fontWeight: 600, px: 0.5, height: 28, borderRadius: 999 }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              maxWidth: 820,
              textWrap: 'balance',
            }}
          >
            Brew better queries with{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(100deg, ${theme.palette.primary.main} 10%, ${isDark ? '#F5A9B3' : '#D4697B'} 90%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BrewQuery
            </Box>
          </Typography>

          <Typography variant="body1" sx={{ maxWidth: 560, color: 'text.secondary', fontSize: '1.0625rem', lineHeight: 1.7 }}>
            Pick a dataset, explore its schema, and solve challenges written against
            the actual data. Every query runs live and gets judged on hidden test cases.
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="center" useFlexGap>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/sql')}
              sx={{ px: 3.5, boxShadow: theme.customShadows.primaryButton }}
            >
              Start practising
            </Button>
            {!isAuthenticated && (
              <Button variant="outlined" color="inherit" size="large" sx={{ px: 3.5 }} onClick={() => navigate('/login')}>
                Create a free account
              </Button>
            )}
          </Stack>

          <Box sx={{ width: '100%', pt: 3 }}>
            <CodePreview />
          </Box>
        </Stack>

        {/* Modules */}
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Modules
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: 2.5,
          }}
        >
          {CARDS.map((card) => {
            const Icon   = card.icon;
            const locked = isLocked(card);
            const tone   = theme.palette[card.tone];

            return (
              <Card
                key={card.title}
                component={locked ? 'div' : 'button'}
                type={locked ? undefined : 'button'}
                onClick={() => !locked && navigate(card.link)}
                aria-disabled={locked || undefined}
                sx={{
                  p: 0, textAlign: 'left', font: 'inherit', color: 'inherit',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: locked ? 'default' : 'pointer',
                  transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
                  '&:hover': locked ? {} : {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.customShadows.raised,
                    borderColor: alpha(tone.main, 0.5),
                  },
                  '&:hover .card-img': locked ? {} : { transform: 'scale(1.06)' },
                  '&:hover .card-cta .MuiSvgIcon-root': { transform: 'translateX(3px)' },
                  '&:focus-visible': { outline: 'none', boxShadow: theme.customShadows.primary },
                }}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', height: 168, overflow: 'hidden', bgcolor: alpha(tone.main, 0.12) }}>
                  <CardMedia
                    component="img"
                    image={card.image}
                    alt=""
                    className="card-img"
                    sx={{
                      height: '100%', objectFit: 'cover', transition: 'transform .5s ease',
                      filter: locked ? 'grayscale(1)' : 'none',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(160deg, ${alpha(tone.main, 0.55)} 0%, ${alpha('#121012', 0.75)} 100%)`,
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute', left: 16, bottom: 16,
                      width: 44, height: 44, borderRadius: 2,
                      display: 'grid', placeItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.14)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color: '#FFFFFF' }} />
                  </Box>

                  {locked && (
                    <Chip
                      icon={<LockIcon sx={{ fontSize: '14px !important', color: '#FFFFFF !important' }} />}
                      label={isAuthenticated ? 'Locked' : 'Coming soon'}
                      size="small"
                      sx={{
                        position: 'absolute', top: 14, right: 14,
                        bgcolor: 'rgba(18,16,18,0.6)', color: '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                      }}
                    />
                  )}
                </Box>

                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Typography variant="h4" component="h3" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65, minHeight: 64 }}>
                    {card.description}
                  </Typography>
                  <Stack
                    className="card-cta"
                    direction="row"
                    alignItems="center"
                    gap={0.5}
                    sx={{
                      fontWeight: 700, fontSize: '0.875rem',
                      color: locked ? 'text.disabled' : (isDark ? tone.light : tone.dark),
                      '& .MuiSvgIcon-root': { transition: 'transform .2s' },
                    }}
                  >
                    {locked ? (isAuthenticated ? 'Not enabled for your account' : 'Coming soon') : 'Open module'}
                    {!locked && <ArrowIcon sx={{ fontSize: 18 }} />}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
