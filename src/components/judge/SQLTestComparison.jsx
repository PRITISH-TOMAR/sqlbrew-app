import { useState } from 'react';
import { Box, Stack, Typography, Chip, useTheme } from '@mui/material';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import GridOnRoundedIcon from '@mui/icons-material/GridOnRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// ── Helpers ────────────────────────────────────────────────────────────────────

function cellStr(val) {
  if (val === null || val === undefined) return '';
  return String(val);
}

function rowKey(row) {
  return row.map(cellStr).join('\x00');
}

function formatCell(val) {
  if (val === null || val === undefined)
    return <span style={{ opacity: 0.35, fontStyle: 'italic' }}>NULL</span>;
  if (val === true)  return 'true';
  if (val === false) return 'false';
  return String(val);
}

/**
 * For each actual row, determine match status against expected rows.
 * - Position match  → { type: 'match' }
 * - Found elsewhere → { type: 'mismatch', label: 'Expected at row N' }
 * - Not in expected → { type: 'mismatch', label: 'Not in expected' }
 */
function buildIndicators(actualRows, expectedRows) {
  const expectedIndex = {};
  expectedRows.forEach((row, i) => {
    const k = rowKey(row);
    if (!expectedIndex[k]) expectedIndex[k] = [];
    expectedIndex[k].push(i + 1);
  });

  return actualRows.map((row, i) => {
    const expRow = expectedRows[i];
    const posMatch =
      expRow &&
      expRow.length === row.length &&
      expRow.every((v, j) => cellStr(v) === cellStr(row[j]));

    if (posMatch) return { type: 'match' };

    const k = rowKey(row);
    const positions = expectedIndex[k];
    if (positions?.length) {
      return { type: 'mismatch', label: `Expected at row ${positions[0]}` };
    }
    return { type: 'mismatch', label: 'Not in expected' };
  });
}

// ── OutputPanel ────────────────────────────────────────────────────────────────

function OutputPanel({ title, icon, columns, rows, indicators }) {
  const theme = useTheme();
  const hasIndicators = Boolean(indicators);

  const TH = {
    padding: '6px 10px',
    fontWeight: 600,
    fontSize: '0.69rem',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
    letterSpacing: 0.4,
  };

  const TD = {
    padding: '5px 10px',
    whiteSpace: 'nowrap',
    fontSize: '0.78rem',
    fontFamily: 'monospace',
    borderBottom: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        gap={0.75}
        sx={{
          px: 2,
          py: 1,
          bgcolor: 'action.hover',
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {icon}
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: 'text.secondary', letterSpacing: 0.6, fontSize: '0.7rem' }}
        >
          {title}
        </Typography>
      </Stack>

      {/* Table */}
      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 34, paddingLeft: 14, color: theme.palette.text.disabled }}>#</th>
              {columns.map((col) => (
                <th key={col} style={TH}>{col}</th>
              ))}
              {hasIndicators && <th style={{ ...TH, width: 150 }} />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasIndicators ? 2 : 1)}
                  style={{ ...TD, textAlign: 'center', color: theme.palette.text.disabled, padding: '20px 10px' }}
                >
                  No rows
                </td>
              </tr>
            ) : (
              rows.map((row, ri) => {
                const ind = indicators?.[ri];
                const mismatch = ind?.type === 'mismatch';
                const match    = ind?.type === 'match';

                return (
                  <tr
                    key={ri}
                    style={{
                      backgroundColor: mismatch
                        ? 'rgba(239, 68, 68, 0.09)'
                        : 'transparent',
                    }}
                  >
                    {/* Row number */}
                    <td style={{ ...TD, paddingLeft: 14, color: theme.palette.text.disabled }}>
                      {ri + 1}
                    </td>

                    {/* Data cells */}
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          ...TD,
                          color: mismatch
                            ? 'rgba(248, 113, 113, 0.9)'
                            : theme.palette.text.primary,
                        }}
                      >
                        {formatCell(cell)}
                      </td>
                    ))}

                    {/* Indicator column */}
                    {hasIndicators && (
                      <td style={{ ...TD, textAlign: 'right', paddingRight: 14 }}>
                        {match && (
                          <span style={{ color: '#4ade80', fontSize: '0.72rem', fontWeight: 600 }}>
                            ✓ Match
                          </span>
                        )}
                        {mismatch && (
                          <span style={{ color: '#f87171', fontSize: '0.71rem' }}>
                            {ind.label}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}

// ── SingleTestComparison ───────────────────────────────────────────────────────

function SingleTestComparison({ tc }) {
  const theme = useTheme();

  if (tc.error) {
    return (
      <Box
        sx={{
          mt: 1, p: 1.5,
          bgcolor: 'error.lighter',
          border: '1px solid',
          borderColor: 'error.light',
          borderRadius: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontFamily: 'monospace', color: 'error.main', whiteSpace: 'pre-wrap', display: 'block' }}
        >
          {tc.error}
        </Typography>
      </Box>
    );
  }

  const expectedCols = tc.expectedOutput?.columns || [];
  const actualCols   = tc.userOutput?.columns     || expectedCols;
  const expectedRows = tc.expectedOutput?.rows    || [];
  const actualRows   = tc.passed ? expectedRows : (tc.userOutput?.rows || []);
  const indicators   = buildIndicators(actualRows, expectedRows);

  return (
    <Stack direction="row" gap={1.5} sx={{ mt: 1.5, minHeight: 180 }}>
      <OutputPanel
        title="Expected Output"
        icon={<TableRowsRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />}
        columns={expectedCols}
        rows={expectedRows}
        indicators={null}
      />
      <OutputPanel
        title="Actual Output"
        icon={<GridOnRoundedIcon sx={{ fontSize: 13, color: 'text.secondary' }} />}
        columns={actualCols}
        rows={actualRows}
        indicators={indicators}
      />
    </Stack>
  );
}

// ── SQLTestComparison (exported) ───────────────────────────────────────────────
/**
 * Props:
 *   testDetails  – TestCaseResult[]
 *     { testCaseId, passed, userOutput: {columns, rows, rowsCount}, expectedOutput: {columns, rows, rowsCount}, error }
 */
export default function SQLTestComparison({ testDetails }) {
  const [active, setActive] = useState(0);

  if (!testDetails?.length) return null;

  const tc     = testDetails[active];
  const passed = tc?.passed === true;

  return (
    <Box>
      {/* TC selector tabs */}
      {testDetails.length > 1 && (
        <Stack direction="row" gap={0.75} mb={1.5} flexWrap="wrap">
          {testDetails.map((t, i) => (
            <Chip
              key={i}
              label={`Case ${i + 1}`}
              size="small"
              onClick={() => setActive(i)}
              color={t.passed ? 'success' : 'error'}
              variant={active === i ? 'filled' : 'outlined'}
              sx={{ fontWeight: 600, fontSize: '0.69rem', cursor: 'pointer' }}
            />
          ))}
        </Stack>
      )}

      {/* Status bar */}
      <Stack direction="row" alignItems="center" gap={0.75}>
        {passed
          ? <CheckCircleIcon sx={{ fontSize: 15, color: 'success.main' }} />
          : <CancelIcon      sx={{ fontSize: 15, color: 'error.main' }} />
        }
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: passed ? 'success.main' : 'error.main' }}
        >
          {testDetails.length > 1 ? `Case ${active + 1} —` : ''} {passed ? 'Passed' : 'Failed'}
        </Typography>
        {tc?.userOutput?.rowsCount != null && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {tc.userOutput.rowsCount} row(s) returned
          </Typography>
        )}
      </Stack>

      <SingleTestComparison tc={tc} />
    </Box>
  );
}
