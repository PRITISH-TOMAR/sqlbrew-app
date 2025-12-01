import { Routes, Route, Navigate } from "react-router-dom";
import AuthContainer from "./pages/authentication/AuthContainer";
import useNavbarHeight from "./hooks/useNavbarHeight";
import useSidebarWidth from "./hooks/useSidebarWidth";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import DatabaseGrid from "./components/databases/DatabaseGrid";
import SQLProblemset from "./pages/problemset/SQLProblemset";

export default function Routing() {
  const user = useSelector((state) => state.auth.user);
  const navbarHeight = useNavbarHeight();
  const sidebarWidth = useSidebarWidth();
  return (
    <div style={{ marginTop: navbarHeight, marginLeft: sidebarWidth }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <AuthContainer />}
        />

        {/* Base routes */}
        <Route path="/sql" element={<DatabaseGrid />} />
        <Route path="/sql/:dbId" element={<SQLProblemset />} />
      </Routes>
    </div>
  );
}
