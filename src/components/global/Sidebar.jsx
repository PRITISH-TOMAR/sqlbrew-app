import { useState } from "react";
import { useSelector } from "react-redux";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard", href: "#" },
  { label: "Users", href: "#" },
  { label: "Settings", href: "#" },
  { label: "Docs", href: "#" },
];

export default function Sidebar() {
  const theme = useSelector((s) => s.theme);
  const [open, setOpen] = useState(false);

  const themeClasses = {
    light: "bg-light-bg text-light-text border-light-text/10",
    dark: "bg-dark-bg text-dark-text border-dark-text/20",
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded border 
        ${themeClasses[theme]}`}
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 shadow-lg 
          transition-transform duration-300 lg:translate-x-0 z-40
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          ${themeClasses[theme]}
        `}
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-bold">BrewQuery</h1>
        </div>

        <nav className="px-4 py-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`block px-4 py-2 rounded font-medium transition-colors
                    hover:bg-primary/10 hover:text-primary
                  `}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Content Overlay for Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
        />
      )}
    </>
  );
}
