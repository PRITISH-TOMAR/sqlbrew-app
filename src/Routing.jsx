import { Routes, Route } from "react-router-dom";
import AuthContainer from "./pages/authentication/AuthContainer";
import useNavbarHeight from "./hooks/useNavbarHeight";
import useSidebarWidth from "./hooks/useSidebarWidth";
import Dashboard from "./pages/Dashboard";

export default function Routing() {
  const navbarHeight = useNavbarHeight();
  const sidebarWidth = useSidebarWidth();
  return (
    <div style={{ marginTop: navbarHeight , marginLeft : sidebarWidth}}>
      <Routes>
        <Route path="/" element={ <Dashboard/>} />
        <Route path="/login" element={<AuthContainer />} />
      </Routes>
    </div>
  );
}
