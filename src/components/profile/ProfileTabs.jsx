import { Box, Tabs, Tab } from '@mui/material';
import PersonIcon       from '@mui/icons-material/PersonOutlined';
import ArticleIcon      from '@mui/icons-material/ArticleOutlined';
import BarChartIcon     from '@mui/icons-material/BarChartOutlined';
import HistoryIcon      from '@mui/icons-material/HistoryOutlined';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTechOutlined';
import BookmarkIcon     from '@mui/icons-material/BookmarkBorderOutlined';

const TABS = [
  { label: 'Overview',    Icon: PersonIcon       },
  { label: 'Submissions', Icon: ArticleIcon      },
  { label: 'Stats',       Icon: BarChartIcon     },
  { label: 'Activity',    Icon: HistoryIcon      },
  { label: 'Badges',      Icon: MilitaryTechIcon },
  { label: 'Bookmarks',   Icon: BookmarkIcon     },
];

export default function ProfileTabs({ activeTab, onChange }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {TABS.map(({ label, Icon }) => (
          <Tab
            key={label}
            label={label}
            icon={<Icon sx={{ fontSize: 16 }} />}
            iconPosition="start"
            sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500, fontSize: 14 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
