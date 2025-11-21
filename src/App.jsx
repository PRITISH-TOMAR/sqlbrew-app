import Sidebar from "./components/global/Sidebar";
import Topbar from "./components/global/Topbar";
import { useSelector } from "react-redux";
import { themeClasses } from "./utils/classes/themeClasses";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Routing from "./Routing";
import ResetPassword from "./components/auth/ResetPassword";

export default function App() {
  const theme = useSelector((s) => s.theme);
  const user = useSelector((s) => s.auth.user);

  return (
    <BrowserRouter>
      <div
        className={`min-h-screen flex flex-col ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
      >
        <Routes>
          <Route path="/credentials/:resetKey" element={<ResetPassword />} />

          <Route
            path="*"
            element={
              <>
                <Topbar />
                {user && <Sidebar />}
                <Routing />
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
