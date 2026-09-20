import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Dashboard      from './pages/Dashboard.jsx';
import DatasetGrid    from './components/databases/DatabaseGrid.jsx';
import { loadSQLDatasets, loadNoSQLDatasets, loadVectorDBDatasets } from './api/databaseApi.js';
import SQLProblemset  from './pages/problemset/SQLProblemset.jsx';
import ProblemSolver  from './pages/problemset/ProblemSolver.jsx';

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

export default function Routing() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"      element={<Dashboard />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthContainer />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>

        {/* SQL */}
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
            cardLabel="Dataset"
            ctaLabel="Start Learning"
          />
        } />
        <Route path="/sql/:dbId"            element={<SQLProblemset />} />
        <Route path="/sql/:dbId/:problemId" element={<ProblemSolver />} />

        {/* NoSQL */}
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
            cardLabel="Collection"
            ctaLabel="Explore Collection"
          />
        } />

        {/* VectorDB */}
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
            cardLabel="Index"
            ctaLabel="Start Searching"
          />
        } />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
