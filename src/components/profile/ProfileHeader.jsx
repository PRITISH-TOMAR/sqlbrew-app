import { useRef, useState }  from 'react';
import {
  Box, Typography, Chip, Avatar, IconButton, Tooltip,
  Skeleton, LinearProgress, Divider, useTheme, CircularProgress,
} from '@mui/material';
import EditIcon      from '@mui/icons-material/EditOutlined';
import EmailIcon     from '@mui/icons-material/EmailOutlined';
import PhoneIcon     from '@mui/icons-material/PhoneOutlined';
import CalendarIcon  from '@mui/icons-material/CalendarTodayOutlined';
import LocationIcon  from '@mui/icons-material/LocationOnOutlined';
import CameraIcon    from '@mui/icons-material/CameraAltOutlined';
import BarChartIcon  from '@mui/icons-material/BarChartOutlined';
import WhatshotIcon  from '@mui/icons-material/WhatshotOutlined';
import StorageIcon   from '@mui/icons-material/StorageOutlined';
import { alpha }     from '@mui/material/styles';
import { uploadAvatar, getAvatarUrl } from '../../api/storageApi.js';

// ── Level hexagon badge ────────────────────────────────────────────────────────
function LevelBadge({ level, title, xpToNext, xpProgress, loading }) {
  const theme = useTheme();
  if (loading) return <Skeleton variant="rounded" width={200} height={90} sx={{ borderRadius: 2 }} />;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 200,
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.04),
      }}
    >
      {/* Hex shape */}
      <Box
        sx={{
          width: 52,
          height: 52,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          bgcolor: theme.palette.mode === 'dark' ? '#1e2a3a' : '#dbeafe',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 8, color: 'text.secondary', lineHeight: 1, fontWeight: 600, letterSpacing: 0.5 }}>
          LEVEL
        </Typography>
        <Typography variant="h6" fontWeight={800} sx={{ color: 'primary.main', lineHeight: 1.1 }}>
          {level ?? '—'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
          {title ?? 'Beginner'}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={xpProgress ?? 0}
          sx={{
            my: 0.5,
            height: 6,
            borderRadius: 3,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': { bgcolor: 'info.main', borderRadius: 3 },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {xpToNext != null ? `${xpToNext} XP to next level` : '—'}
        </Typography>
      </Box>
    </Box>
  );
}

// ── Vertical stat block ────────────────────────────────────────────────────────
function StatBlock({ icon, value, label, loading }) {
  if (loading) return <Skeleton variant="rounded" width={96} height={64} sx={{ borderRadius: 1 }} />;
  return (
    <Box sx={{ textAlign: 'center', px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.25 }}>{icon}</Box>
      <Typography variant="h5" fontWeight={700}>{value ?? '—'}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3 }}>{label}</Typography>
    </Box>
  );
}

// ── Info row (icon + text) ────────────────────────────────────────────────────
function InfoRow({ icon, text }) {
  if (!text) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
  );
}

// ── Main header ───────────────────────────────────────────────────────────────
export default function ProfileHeader({ profile, loading, isOwner, userId }) {
  const p = profile ?? {};
  const fileInputRef  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null); // overrides profile.avatar after upload

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    e.target.value = ''; // reset so the same file can be re-selected if needed
    setUploading(true);
    try {
      const url = await uploadAvatar(userId, file);
      if (url) setAvatarSrc(`${url}?t=${Date.now()}`); // bust CDN cache
    } finally {
      setUploading(false);
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        position: 'relative',
      }}
    >
      {/* Edit Profile button — top-right */}
      {isOwner && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Chip
            icon={<EditIcon sx={{ fontSize: 14 }} />}
            label="Edit Profile"
            variant="outlined"
            size="small"
            clickable
            sx={{ fontWeight: 500, fontSize: 12 }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexWrap: 'wrap', alignItems: 'flex-start', pr: isOwner ? 14 : 0 }}>

        {/* Hidden file input — triggered by the camera button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />

        {/* Avatar */}
        <Box sx={{ position: 'relative', flexShrink: 0 }}>
          {loading ? (
            <Skeleton variant="circular" width={96} height={96} />
          ) : (
            <Avatar
              src={avatarSrc ?? p.avatar}
              alt={p.name}
              sx={{ width: 96, height: 96, fontSize: 36, bgcolor: 'primary.main', opacity: uploading ? 0.5 : 1 }}
            >
              {p.name?.[0]?.toUpperCase()}
            </Avatar>
          )}
          {uploading && (
            <CircularProgress
              size={32}
              sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-16px', ml: '-16px' }}
            />
          )}
          {isOwner && !loading && (
            <Tooltip title="Change avatar">
              <IconButton
                size="small"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 0.4,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <CameraIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Name + contact + bio */}
        <Box sx={{ flex: 1, minWidth: 180 }}>
          {loading ? (
            <>
              <Skeleton width={200} height={32} />
              <Skeleton width={160} height={18} sx={{ mt: 0.75 }} />
              <Skeleton width={140} height={18} sx={{ mt: 0.5 }} />
              <Skeleton width={200} height={18} sx={{ mt: 1 }} />
            </>
          ) : (
            <>
              {/* Name + role badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.75 }}>
                <Typography variant="h5" fontWeight={700}>{p.name ?? 'User'}</Typography>
                {p.role && (
                  <Chip
                    label={p.role}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: 11 }}
                  />
                )}
              </Box>

              {/* Email / Phone */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 0.5 }}>
                <InfoRow icon={<EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />} text={p.email} />
                <InfoRow icon={<PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />} text={p.phone} />
              </Box>

              {/* Joined / Location */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                <InfoRow icon={<CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />} text={p.joinedAt ? `Joined ${p.joinedAt}` : null} />
                <InfoRow icon={<LocationIcon sx={{ fontSize: 14, color: 'text.secondary' }} />} text={p.location} />
              </Box>

              {/* Bio */}
              {p.bio && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    "{p.bio}"
                  </Typography>
                  {isOwner && (
                    <IconButton size="small" sx={{ p: 0.25 }}>
                      <EditIcon sx={{ fontSize: 13 }} />
                    </IconButton>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Level badge */}
        <LevelBadge
          level={p.level?.number}
          title={p.level?.title}
          xpToNext={p.level?.xpToNext}
          xpProgress={p.level?.xpProgress}
          loading={loading}
        />

        {/* Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StatBlock
            icon={<BarChartIcon sx={{ fontSize: 20, color: 'primary.main' }} />}
            value={p.stats?.questionsSolved}
            label="Questions Solved"
            loading={loading}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <StatBlock
            icon={<WhatshotIcon sx={{ fontSize: 20, color: 'warning.main' }} />}
            value={p.stats?.dayStreak}
            label="Day Streak"
            loading={loading}
          />
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <StatBlock
            icon={<StorageIcon sx={{ fontSize: 20, color: 'secondary.main' }} />}
            value={p.stats?.datasetsCompleted}
            label="Datasets Completed"
            loading={loading}
          />
        </Box>

      </Box>
    </Box>
  );
}
