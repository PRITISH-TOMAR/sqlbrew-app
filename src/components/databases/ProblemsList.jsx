import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, useTheme, Box, Typography, Skeleton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/StarBorderOutlined';
import BookmarkIcon from '@mui/icons-material/BookmarkBorderOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useParams } from 'react-router-dom';

const LEVEL_CHIP = {
  easy:   { color: 'success', label: 'Easy' },
  medium: { color: 'warning', label: 'Medium' },
  hard:   { color: 'error',   label: 'Hard' },
};

function ProblemRow({ index, item, dbId, problemIds }) {
  const theme    = useTheme();
  const navigate = useNavigate();
  const level = item?.difficulty?.toLowerCase();
  const chip  = LEVEL_CHIP[level] || { color: 'default', label: item?.difficulty };

  return (
    <TableRow
      hover
      onClick={() => navigate(`/sql/${dbId}/${item?.id}`, { state: { problemIds } })}
      sx={{
        cursor: 'pointer',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell sx={{ color: 'text.secondary', width: 60 }}>{index}</TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {item?.title}
          </Typography>
          {item?.locked && (
            <LockIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          )}
        </Box>
      </TableCell>

      <TableCell sx={{ width: 120 }}>
        <Chip
          label={chip.label}
          color={chip.color}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, textTransform: 'capitalize' }}
        />
      </TableCell>

      <TableCell sx={{ width: 200, color: 'text.secondary' }}>
        <IconButton size="small">
          <BookmarkIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </TableCell>

      <TableCell align="right" sx={{ width: 60 }}>
        <IconButton size="small">
          <StarIcon sx={{ fontSize: 18, '&:hover': { color: 'warning.main' } }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton variant="text" width={24} /></TableCell>
      <TableCell><Skeleton variant="text" width="70%" /></TableCell>
      <TableCell><Skeleton variant="rounded" width={60} height={22} /></TableCell>
      <TableCell><Skeleton variant="text" width={28} /></TableCell>
      <TableCell align="right"><Skeleton variant="text" width={28} sx={{ ml: 'auto' }} /></TableCell>
    </TableRow>
  );
}

export default function ProblemsList({ items, loading }) {
  const { dbId } = useParams();
  const problemIds = items.map((item) => item?.id);
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 60 }}>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell sx={{ width: 120 }}>Level</TableCell>
            <TableCell sx={{ width: 200 }}>Notes</TableCell>
            <TableCell align="right" sx={{ width: 60 }}>★</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
            : items.map((item, idx) => (
                <ProblemRow key={item?.id} index={idx + 1} item={item} dbId={dbId} problemIds={problemIds} />
              ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
