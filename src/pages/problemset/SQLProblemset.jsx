import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import DatabaseBar   from '../../components/databases/DatabaseBar.jsx';
import ProblemsList  from '../../components/databases/ProblemsList.jsx';
import { loadDatasetDetails, loadSQLQuestionSet } from '../../api/databaseApi';

export default function SQLProblemset() {
  const { dbId } = useParams();
  const [data,            setData]            = useState(null);
  const [problems,        setProblems]        = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  useEffect(() => {
    let alive = true;
    loadDatasetDetails(dbId).then((res) => { if (alive && res.success) setData(res.data); });
    return () => { alive = false; };
  }, [dbId]);

  useEffect(() => {
    let alive = true;
    setLoadingProblems(true);
    loadSQLQuestionSet(dbId).then((res) => {
      if (alive && res.success) setProblems(res.data);
      if (alive) setLoadingProblems(false);
    });
    return () => { alive = false; };
  }, [dbId]);

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <ProblemsList items={problems} loading={loadingProblems} />
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'block' }, width: 260, flexShrink: 0 }}>
        <DatabaseBar database={data || {}} />
      </Box>
    </Box>
  );
}
