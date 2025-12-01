// REACT IMPROTS
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

// IMPORTS
import { themeClasses } from "../../utils/classes/themeClasses";
import useNavbarHeight from "../../hooks/useNavbarHeight";

// UTILITIES
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  InboxIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

// TODO : Make these server side render .
const sidebarItems = [
  {
    type: "accordion",
    label: "Dashboard",
    icon: PresentationChartBarIcon,
    children: [
      { label: "SQL", path: "/sql" },
      { label: "NO SQL", path: "/nosql" },
      { label: "Vector Database", path: "/vector-database" },
    ],
  },
  {
    type: "accordion",
    label: "Resources",
    icon: ShoppingBagIcon,
    children: [
      { label: "Redis", path: "/redis" },
      { label: "Guide", path: "/guide" },
    ],
  },
  {
    type: "link",
    label: "Progress",
    icon: InboxIcon,
    path: "/progress",
  },
  {
    type: "link",
    label: "Contests",
    icon: Cog6ToothIcon,
    path: "/contests",
  },
];

export default function Sidebar() {
  // HOOKS
  const theme = useSelector((s) => s.theme);
  const navbarHeight = useNavbarHeight();
  const navigate = useNavigate();
  const location = useLocation();
  const dragStartX = useRef(null);

  // STATES
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordion, setAccordion] = useState(null);

  // FUNCTION: HANDLE ACCORDION
  const handleAccordion = (index) => {
    setAccordion(accordion === index ? null : index);
  };

  // FUNCTION: HANDLE DRAG EVENTS
  const handleDragStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
  };

  const handleDragMove = (e) => {
    if (!dragStartX.current) return;
    const diff = e.touches[0].clientX - dragStartX.current;

    if (diff < -50) {
      setDrawerOpen(false);
      dragStartX.current = null;
    }
  };

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`lg:hidden fixed top-4 left-2 z-[10000] rounded
          backdrop-blur-lg bg-white/10 shadow-xl 
          ${themeClasses[theme].text}`}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* SIDEBAR */}
      <aside
        id="app-sidebar"
        style={{ marginTop: navbarHeight }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        className={`fixed left-0 h-full w-64 z-[200]
          transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]
          border-r backdrop-blur-xl 
          ${drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${themeClasses[theme].navBg}
          ${themeClasses[theme].border}
        `}
      >
        <ul className="p-4 flex flex-col gap-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;

            // ACCORDION
            if (item.type === "accordion") {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleAccordion(index)}
                    className={`
                      flex items-center w-full p-3 rounded-lg 
                      transition-all duration-200
                      hover:bg-white/10
                      ${accordion === index ? "bg-white/10 shadow-inner" : ""}
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3 opacity-90" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        accordion === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Smooth Accordion */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300
                      ${
                        accordion === index
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <ul className="ml-10 mt-2 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <li
                          key={child.label}
                          onClick={() => navigate(child.path)}
                          className={`
                            flex items-center gap-2 p-2 rounded-md cursor-pointer
                            transition-all duration-200 hover:bg-white/10
                            ${
                              location.pathname === child.path
                                ? "bg-primary/10"
                                : ""
                            }
                          `}
                        >
                          <ChevronRightIcon className="h-3 w-3 opacity-80" />
                          <span>{child.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            }

            // LINK ITEM
            return (
              <li
                key={item.label}
                className={`
                  p-3 flex items-center gap-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  hover:bg-white/10
                  ${
                    location.pathname === item.path
                      ? "bg-primary/10 shadow-md"
                      : ""
                  }
                `}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5 opacity-90" />
                <span className="font-medium">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* MOBILE BACKDROP */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
        />
      )}
    </>
  );
}
