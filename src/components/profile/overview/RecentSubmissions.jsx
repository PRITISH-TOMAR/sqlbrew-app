import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Skeleton, Button,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const LEVEL_CHIP = {
  easy:   { color: 'success', label: 'Easy' },
  medium: { color: 'warning', label: 'Medium' },
  hard:   { color: 'error',   label: 'Hard' },
};

function ResultChip({ result }) {
  const accepted = result?.toLowerCase() === 'accepted';
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {accepted
        ? <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
        : <CancelIcon      sx={{ fontSize: 14, color: 'error.main' }} />}
      <Typography
        variant="caption"
        fontWeight={600}
        sx={{ color: accepted ? 'success.main' : 'error.main' }}
      >
        {result ?? '—'}
      </Typography>
    </Box>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableCell key={i}><Skeleton variant="text" width={i === 1 ? '80%' : 48} /></TableCell>
      ))}
    </TableRow>
  );
}

function SubmissionRow({ index, item }) {
  const level = item?.level?.toLowerCase();
  const chip  = LEVEL_CHIP[level] || { color: 'default', label: item?.level };

  return (
    <TableRow hover sx={{ '&:last-child td': { border: 0 } }}>
      <TableCell sx={{ color: 'text.secondary', width: 44 }}>{index}</TableCell>
      <TableCell>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        >
          {item?.questionTitle ?? '—'}
        </Typography>
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{item?.dataset ?? '—'}</TableCell>
      <TableCell sx={{ width: 90 }}>
        <Chip
          label={chip.label}
          color={chip.color}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: 11 }}
        />
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', width: 60 }}>{item?.language ?? '—'}</TableCell>
      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap', width: 80 }}>{item?.timeTaken ?? '—'}</TableCell>
      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap', width: 160 }}>{item?.submittedAt ?? '—'}</TableCell>
      <TableCell sx={{ width: 110 }}><ResultChip result={item?.result} /></TableCell>
    </TableRow>
  );
}

export default function RecentSubmissions({ items, loading }) {
  return (
    <Paper
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon sx={{ fontSize: 18, color: 'primary.main' }} />
          <Typography variant="subtitle1" fontWeight={600}>Recent Submissions</Typography>
        </Box>
        <Button size="small" variant="outlined" sx={{ fontSize: 12, textTransform: 'none', height: 30 }}>
          View All
        </Button>
      </Box>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 44 }}>#</TableCell>
              <TableCell>Question Title</TableCell>
              <TableCell>Dataset</TableCell>
              <TableCell sx={{ width: 90 }}>Level</TableCell>
              <TableCell sx={{ width: 60 }}>Language</TableCell>
              <TableCell sx={{ width: 80 }}>Time Taken</TableCell>
              <TableCell sx={{ width: 160 }}>Submitted At</TableCell>
              <TableCell sx={{ width: 110 }}>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : items.length > 0
                ? items.map((item, idx) => <SubmissionRow key={item?.id ?? idx} index={idx + 1} item={item} />)
                : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No submissions yet.
                    </TableCell>
                  </TableRow>
                )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
