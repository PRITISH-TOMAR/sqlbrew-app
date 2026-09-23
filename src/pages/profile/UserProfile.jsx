import { useEffect, useState } from 'react';
import { useParams }           from 'react-router-dom';
import { useSelector }         from 'react-redux';
import { Box, Typography }     from '@mui/material';

import ProfileHeader  from '../../components/profile/ProfileHeader.jsx';
import ProfileTabs    from '../../components/profile/ProfileTabs.jsx';
import OverviewTab    from '../../components/profile/OverviewTab.jsx';

import {
  loadUserProfile,
  loadUserStats,
  loadUserSubmissions,
  loadUserHeatmap,
} from '../../api/profileApi.js';

// Placeholder for tabs that are not yet implemented
function ComingSoon({ label }) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">{label} — Coming Soon</Typography>
    </Box>
  );
}

const TAB_CONTENT = [
  null, // 0 = Overview (rendered separately)
  'Submissions',
  'Stats',
  'Activity',
  'Badges',
  'Bookmarks',
];

export default function UserProfile() {
  const { userId }    = useParams();
  const currentUser   = useSelector((s) => s.auth.user);
  const isOwner       = String(currentUser?.userId) === String(userId);

  const [activeTab,    setActiveTab]    = useState(0);
  const [profile,      setProfile]      = useState(null);
  const [stats,        setStats]        = useState(null);
  const [submissions,  setSubmissions]  = useState([]);
  const [heatmap,      setHeatmap]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setProfile(null);
    setStats(null);
    setSubmissions([]);
    setHeatmap([]);

    Promise.all([
      loadUserProfile(userId),
      loadUserStats(userId),
      loadUserSubmissions(userId, { limit: 5 }),
      loadUserHeatmap(userId),
    ]).then(([profileRes, statsRes, subsRes, heatmapRes]) => {
      if (!alive) return;
      if (profileRes.success)  setProfile(profileRes.data);
      if (statsRes.success)    setStats(statsRes.data);
      if (subsRes.success)     setSubmissions(subsRes.data ?? []);
      if (heatmapRes.success)  setHeatmap(heatmapRes.data ?? []);
      setLoading(false);
    });

    return () => { alive = false; };
  }, [userId]);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1280, mx: 'auto', width: '100%' }}>

      <ProfileHeader profile={profile} loading={loading} isOwner={isOwner} userId={userId} />

      <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 ? (
          <OverviewTab
            stats={stats}
            submissions={submissions}
            heatmap={heatmap}
            loading={loading}
          />
        ) : (
          <ComingSoon label={TAB_CONTENT[activeTab]} />
        )}
      </Box>

    </Box>
  );
}
