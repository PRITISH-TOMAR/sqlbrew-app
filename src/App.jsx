import Sidebar from "./components/global/Sidebar";
import Topbar from "./components/global/Topbar";
import { useSelector } from "react-redux";
import { themeClasses } from "./utils/themeClasses";

export default function App() {
  const theme = useSelector((s) => s.theme);
  const user = useSelector((s) => s.auth.user);

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses[theme]}`}>
      <Topbar />
      {user && <Sidebar />}

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome to BrewQuery</h1>
        <p className="mt-2 text-center">Your themed, responsive sidebar is ready!</p>
      </main>
    </div>
  );
}
