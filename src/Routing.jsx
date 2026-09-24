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

// ─── SQL — Blue ──────────────────────────────────────────────────────────────
const SQL_COLOR    = '#2563eb';
const SQL_FEATURES = [
  { icon: <PracticeIcon  sx={{ fontSize: 18, color: '#60a5fa' }} />, label: 'Hands-on Practice',   description: 'Real-world datasets'    },
  { icon: <StructuredIcon sx={{ fontSize: 18, color: '#34d399' }} />, label: 'Structured Learning', description: 'From basics to advanced' },
  { icon: <TrophyIcon    sx={{ fontSize: 18, color: '#fbbf24' }} />, label: 'Build Your Skills',   description: 'Solve challenges'       },
];

// ─── NoSQL — Green ───────────────────────────────────────────────────────────
const NOSQL_COLOR    = '#16a34a';
const NOSQL_FEATURES = [
  { icon: <FlexibleIcon sx={{ fontSize: 18, color: '#4ade80' }} />, label: 'Schema Flexibility',  description: 'Documents & key-value'  },
  { icon: <SpeedIcon    sx={{ fontSize: 18, color: '#facc15' }} />, label: 'High Performance',    description: 'Built for scale'        },
  { icon: <SearchIcon   sx={{ fontSize: 18, color: '#60a5fa' }} />, label: 'Rich Querying',       description: 'Aggregations & indexes' },
];

// ─── VectorDB — Purple ───────────────────────────────────────────────────────
const VECTORDB_COLOR    = '#7c3aed';
const VECTORDB_FEATURES = [
  { icon: <EmbeddingIcon sx={{ fontSize: 18, color: '#c084fc' }} />, label: 'Embeddings',        description: 'Semantic vector search'  },
  { icon: <BoltIcon      sx={{ fontSize: 18, color: '#fbbf24' }} />, label: 'ANN Search',        description: 'Approximate nearest neighbor' },
  { icon: <TuneIcon      sx={{ fontSize: 18, color: '#34d399' }} />, label: 'Fine-tune & Filter', description: 'Metadata + vector hybrid' },
];

// ─────────────────────────────────────────────────────────────────────────────

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 2 }}>
        <LockIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
        <Typography variant="h6" color="text.secondary">
          {moduleKey} module is not enabled for your account
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Contact your admin or upgrade your plan to gain access.
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
              badge="LEARN • PRACTICE • GROW"
              title="Database"
              titleHighlight="Learning Paths"
              subtitle="Explore our comprehensive database courses and challenges"
              features={SQL_FEATURES}
              pageKey="sql"
              cardLabel="Dataset"
              ctaLabel="Start Learning"
            />
          } />
          <Route path="/sql/:dbId"            element={<SQLProblemset />} />
          <Route path="/sql/:dbId/:problemId" element={<ProblemSolver />} />
        </Route>

        {/* User Profile */}
        <Route path="/master/:userId" element={<UserProfile />} />

        {/* NoSQL */}
        <Route element={<ModuleGuard moduleKey="NOSQL" />}>
          <Route path="/nosql" element={
            <DatasetGrid
              fetchFn={loadNoSQLDatasets}
              basePath="/nosql"
              accentColor={NOSQL_COLOR}
              badge="DOCUMENTS • KEY-VALUE • GRAPHS"
              title="NoSQL"
              titleHighlight="Collections"
              subtitle="Master non-relational databases with real-world document and graph datasets"
              features={NOSQL_FEATURES}
              pageKey="nosql"
              cardLabel="Collection"
              ctaLabel="Explore Collection"
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
              badge="EMBEDDINGS • SEARCH • AI"
              title="Vector"
              titleHighlight="Databases"
              subtitle="Learn vector search and semantic similarity with AI-powered dataset challenges"
              features={VECTORDB_FEATURES}
              pageKey="vectordb"
              cardLabel="Index"
              ctaLabel="Start Searching"
            />
          } />
        </Route>

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
