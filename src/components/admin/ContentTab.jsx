import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import DatasetManager  from './DatasetManager.jsx';
import QuestionManager from './QuestionManager.jsx';

const TABS = [
  { label: 'Datasets',  desc: 'Create, edit, or soft-delete datasets.' },
  { label: 'Questions', desc: 'Manage questions — click a row to view and edit its test cases and expected solutions inline.' },
];

export default function ContentTab() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        {TABS.map((t) => <Tab key={t.label} label={t.label} />)}
      </Tabs>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {TABS[tab].desc}
        {' '}Operations are gated by your module permissions (WRITE / DELETE).
      </Typography>

      {tab === 0 && <DatasetManager />}
      {tab === 1 && <QuestionManager />}
    </Box>
  );
}
