// REACT MODULES
import React, { useEffect, useState } from "react";

// IMPORTS
import DatabaseBar from "../../components/databases/DatabaseBar";
import ProblemsList from "../../components/databases/ProblemsList";
import useNavbarHeight from "../../hooks/useNavbarHeight";
import { loadDatasetDetails, loadSQLQuestionSet } from "../../api/databaseApi";
import { useParams } from "react-router-dom";

const SQLProblemset = () => {
  // HOOKS
  const navbarHeight = useNavbarHeight();
  const { dbId } = useParams();

  // STATES
  const [data, setData] = useState(null);
  const [problems, setProblems] = useState([]);

  // USEFFECT : Load Dataset Details
  useEffect(() => {
    let isMounted = true;

    loadDatasetDetails(dbId).then((response) => {
      if (isMounted && response.success) {
        setData(response.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dbId]);

  // USEFFECT : Load Problems
  useEffect(() => {
    let isMounted = true;

    loadSQLQuestionSet(dbId).then((response) => {
      if (isMounted && response.success) {
        setProblems(response.data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dbId]);

  return (
    <div
      style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
      className="flex w-full"
    >
      <div className="w-full lg:w-4/5">
        <ProblemsList items={problems || []} />
      </div>
      <div className="hidden lg:block w-1/5 overflow-hidden">
        <DatabaseBar database={data || {}} />
      </div>
    </div>
  );
};

export default SQLProblemset;
