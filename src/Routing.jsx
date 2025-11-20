import { Routes, Route } from "react-router-dom";
import AuthContainer from "./pages/authentication/AuthContainer";
import useNavbarHeight from "./hooks/useNavbarHeight";

export default function Routing() {
  const navbarHeight = useNavbarHeight();
  return (
    <div style={{ paddingTop: navbarHeight }}>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<AuthContainer />} />
      </Routes>
    </div>
  );
}
