import { Box } from '@mui/material';
import SubmissionHeatmap  from './overview/SubmissionHeatmap.jsx';
import StatsPanel         from './overview/StatsPanel.jsx';
import RecentSubmissions  from './overview/RecentSubmissions.jsx';
import DifficultyChart    from './overview/DifficultyChart.jsx';
import FavouriteDatasets  from './overview/FavouriteDatasets.jsx';
import RecentBadges       from './overview/RecentBadges.jsx';

export default function OverviewTab({ stats, submissions, heatmap, loading }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Row 1: Heatmap (wider) + Stats Panel */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'stretch' }}>
        <Box sx={{ flex: '1 1 58%', minWidth: 0 }}>
          <SubmissionHeatmap data={heatmap} loading={loading} />
        </Box>
        <Box sx={{ flex: '1 1 38%', minWidth: 0 }}>
          <StatsPanel stats={stats} loading={loading} />
        </Box>
      </Box>

      {/* Row 2: Recent Submissions */}
      <RecentSubmissions items={submissions} loading={loading} />

      {/* Row 3: Difficulty + Favourite Datasets + Recent Badges */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' }, alignItems: 'stretch' }}>
        <Box sx={{ flex: '1 1 30%', minWidth: 220 }}>
          <DifficultyChart data={stats?.difficulty} loading={loading} />
        </Box>
        <Box sx={{ flex: '1 1 30%', minWidth: 220 }}>
          <FavouriteDatasets data={stats?.favouriteDatasets} loading={loading} />
        </Box>
        <Box sx={{ flex: '1 1 30%', minWidth: 220 }}>
          <RecentBadges badges={stats?.recentBadges} loading={loading} />
        </Box>
      </Box>

    </Box>
  );
}
