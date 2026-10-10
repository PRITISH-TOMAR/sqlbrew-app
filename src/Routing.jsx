import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import PracticeIcon from '@mui/icons-material/MenuBookOutlined';
import StructuredIcon from '@mui/icons-material/BarChartOutlined';
import TrophyIcon from '@mui/icons-material/EmojiEventsOutlined';
import SpeedIcon from '@mui/icons-material/SpeedOutlined';
import FlexibleIcon from '@mui/icons-material/AccountTreeOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import EmbeddingIcon from '@mui/icons-material/ScatterPlotOutlined';
import TuneIcon from '@mui/icons-material/TuneOutlined';
import AuthContainer  from './pages/authentication/AuthContainer.jsx';
import VerifyEmail    from './pages/authentication/VerifyEmail.jsx';
import Dashboard      from './pages/Dashboard.jsx';
import DatasetGrid    from './components/databases/DatabaseGrid.jsx';
import { loadSQLDatasets, loadNoSQLDatasets, loadVectorDBDatasets } from './api/databaseApi.js';
import SQLProblemset  from './pages/problemset/SQLProblemset.jsx';
import ProblemSolver  from './pages/problemset/ProblemSolver.jsx';
import UserProfile    from './pages/profile/UserProfile.jsx';
import AdminPortal    from './pages/admin/AdminPortal.jsx';

// Feature icons sit on the always-dark hero band, so they use the dark-mode Garnet tones.
const HERO_ICON = { rose: '#F08A97', green: '#7FD8A6', amber: '#F5B544', blue: '#6AB0F5', violet: '#B79BF2' };

// ─── SQL — Garnet (brand) ────────────────────────────────────────────────────
const SQL_COLOR    = undefined; // use theme primary
const SQL_FEATURES = [
  { icon: <PracticeIcon  sx={{ fontSize: 18, color: HERO_ICON.rose  }} />, label: 'Hands-on practice',   description: 'Real-world datasets'    },
  { icon: <StructuredIcon sx={{ fontSize: 18, color: HERO_ICON.green }} />, label: 'Structured learning', description: 'From basics to advanced' },
  { icon: <TrophyIcon    sx={{ fontSize: 18, color: HERO_ICON.amber }} />, label: 'Instant feedback',    description: 'Judged on hidden tests'       },
];

// ─── NoSQL — Green ───────────────────────────────────────────────────────────
const NOSQL_COLOR    = '#15804F';
const NOSQL_FEATURES = [
  { icon: <FlexibleIcon sx={{ fontSize: 18, color: HERO_ICON.green }} />, label: 'Schema Flexibility',  description: 'Documents & key-value'  },
  { icon: <SpeedIcon    sx={{ fontSize: 18, color: HERO_ICON.amber }} />, label: 'High Performance',    description: 'Built for scale'        },
  { icon: <SearchIcon   sx={{ fontSize: 18, color: HERO_ICON.blue  }} />, label: 'Rich Querying',       description: 'Aggregations & indexes' },
];

// ─── VectorDB — Violet ───────────────────────────────────────────────────────
const VECTORDB_COLOR    = '#7C4DCC';
const VECTORDB_FEATURES = [
  { icon: <EmbeddingIcon sx={{ fontSize: 18, color: HERO_ICON.violet }} />, label: 'Embeddings',        description: 'Semantic vector search'  },
  { icon: <BoltIcon      sx={{ fontSize: 18, color: HERO_ICON.amber  }} />, label: 'ANN Search',        description: 'Approximate nearest neighbor' },
  { icon: <TuneIcon      sx={{ fontSize: 18, color: HERO_ICON.green  }} />, label: 'Fine-tune & Filter', description: 'Metadata + vector hybrid' },
];

// ─────────────────────────────────────────────────────────────────────────────

const MODULE_NAMES = { SQL: 'SQL', NOSQL: 'NoSQL', VECTORDB: 'Vector Database' };

function ProtectedRoute() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function ModuleGuard({ moduleKey }) {
  const { data, loading } = useSelector((s) => s.config);

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const module = data.modules?.find((m) => m.key === moduleKey);
  if (!module || !module.enabled) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 1.5, px: 3, textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'primary.lighter', color: 'primary.main', display: 'grid', placeItems: 'center', mb: 1 }}>
          <LockIcon sx={{ fontSize: 30 }} />
        </Box>
        <Typography variant="h4" component="h1">
          {MODULE_NAMES[moduleKey] ?? moduleKey} isn't enabled for your account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
          Ask your admin to turn it on, or upgrade your plan to get access.
        </Typography>
      </Box>
    );
  }

  return <Outlet />;
}

export default function Routing() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"             element={<Dashboard />} />
      <Route path="/login"        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthContainer />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>

        {/* SQL */}
        <Route element={<ModuleGuard moduleKey="SQL" />}>
          <Route path="/sql" element={
            <DatasetGrid
              fetchFn={loadSQLDatasets}
              basePath="/sql"
              accentColor={SQL_COLOR}
              badge="SQL"
              title="Practise SQL on"
              titleHighlight="real datasets"
              subtitle="Each dataset is a real schema with its own set of problems, from simple filters to window functions. Pick one to start."
              features={SQL_FEATURES}
              pageKey="sql"
              cardLabel="Dataset"
              ctaLabel="Open dataset"
            />
          } />
          <Route path="/sql/:dbId"            element={<SQLProblemset />} />
          <Route path="/sql/:dbId/:problemId" element={<ProblemSolver />} />
        </Route>

        {/* User Profile */}
        <Route path="/master/:userId" element={<UserProfile />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminPortal />} />

        {/* NoSQL */}
        <Route element={<ModuleGuard moduleKey="NOSQL" />}>
          <Route path="/nosql" element={
            <DatasetGrid
              fetchFn={loadNoSQLDatasets}
              basePath="/nosql"
              accentColor={NOSQL_COLOR}
              badge="NOSQL"
              title="Practise NoSQL on"
              titleHighlight="real collections"
              subtitle="Work with document and key-value data, then query it with aggregation pipelines and indexes."
              features={NOSQL_FEATURES}
              pageKey="nosql"
              cardLabel="Collection"
              ctaLabel="Open collection"
            />
          } />
        </Route>

        {/* VectorDB */}
        <Route element={<ModuleGuard moduleKey="VECTORDB" />}>
          <Route path="/vectordb" element={
            <DatasetGrid
              fetchFn={loadVectorDBDatasets}
              basePath="/vectordb"
              accentColor={VECTORDB_COLOR}
              badge="VECTOR DATABASE"
              title="Practise"
              titleHighlight="vector search"
              subtitle="Store embeddings and run similarity search with metadata filters on real datasets."
              features={VECTORDB_FEATURES}
              pageKey="vectordb"
              cardLabel="Index"
              ctaLabel="Open index"
            />
          } />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
