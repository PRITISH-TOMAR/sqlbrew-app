import { useState } from 'react';
import { Box, FormControl, Select, MenuItem } from '@mui/material';
import DatasetManager  from './DatasetManager.jsx';
import QuestionManager from './QuestionManager.jsx';

const CHALK_FONT = "'Caveat', cursive";
const BORDER     = '1.5px solid rgba(255,255,255,0.5)';

const MODULES = ['Datasets', 'Questions'];

export default function ContentTab() {
  const [module, setModule] = useState(0);

  return (
    <Box>
      {/* Toolbar row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <FormControl size="small">
          <Select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            sx={{
              fontFamily: CHALK_FONT,
              fontSize: '1.05rem',
              color: '#fff',
              border: BORDER,
              borderRadius: '8px',
              minWidth: 180,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-icon': { color: '#fff' },
              bgcolor: 'transparent',
            }}
          >
            {MODULES.map((m, i) => (
              <MenuItem key={m} value={i} sx={{ fontFamily: CHALK_FONT, fontSize: '1.05rem' }}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Content area */}
      <Box
        sx={{
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: '10px',
          p: 2,
          minHeight: 300,
        }}
      >
        {module === 0 && <DatasetManager />}
        {module === 1 && <QuestionManager />}
      </Box>
    </Box>
  );
}
