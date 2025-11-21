// REACT MODULES
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// IMPORTS
import { toggleTheme } from "../../redux/slices/themeSlice";
import { themeClasses } from "../../utils/classes/themeClasses";
import brewQuery from "../../assets/images/brewQuery.png";

// UTILITIES
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { IoSunnySharp, IoMoon, IoSunny } from "react-icons/io5";

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      id="app-navbar"
      className={`
        w-full h-16 px-6 flex items-center justify-between 
        border-b shadow-sm fixed top-0 left-0 z-50
        ${themeClasses[theme].bg}
        ${themeClasses[theme].text}
      `}
    >
      <div className="flex items-center gap-3">
        <img
          src={brewQuery}
          alt="logo"
          className={`h-28 w-32 transition-all duration-300 
    ${theme === "dark" ? "invert brightness-900" : ""}
  `}
        />
      </div>

      <div className="hidden md:flex w-1/3 relative">
        <input
          type="text"
          placeholder="Search..."
          className={`
            w-full px-4 py-2 rounded-lg border 
            bg-transparent outline-none
            ${
              theme === "light"
                ? "border-gray-300 text-light-text"
                : "border-gray-600 text-dark-text"
            }
          `}
        />
        <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 opacity-70" />
      </div>

      <div className="flex items-center gap-4">
        <button
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <IoMoon size={20} />
          ) : (
            <IoSunny color="yellow" size={20} />
          )}
        </button>

        {!isAuthenticated && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Login
            </button>
          </>
        )}

        {isAuthenticated && (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <img
                src={user?.avatar || "https://i.pravatar.cc/100"}
                className="h-8 w-8 rounded-full border"
                alt="user"
              />
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  openMenu ? "rotate-180" : ""
                }`}
              />
            </div>

            {openMenu && (
              <div
                className={`
                  absolute right-0 mt-2 w-40 rounded-lg shadow-lg border 
                  p-2 ${themeClasses[theme]}
                `}
              >
                <a className="block px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Profile
                </a>
                <a className="block px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                  Settings
                </a>
                <a className="block px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                  Logout
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
