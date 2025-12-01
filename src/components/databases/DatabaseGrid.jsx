// REACT MODULES
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// IMPORTS
import Pagination from "../global/Pagination";
import { themeClasses } from "../../utils/classes/themeClasses";
import { useSelector } from "react-redux";
import { loadSQLDatasets } from "../../api/databaseApi";

// UTILITIES
import { Database, Star, BookOpen, Tag } from "lucide-react";

const DatabaseCard = ({ database }) => {
  // HOOKS
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "bg-green-100 text-green-800 border-green-300",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
      advanced: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      colors[difficulty.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  return (
    <article
      className={`bg-gray-100 rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-xl transition-shadow h-full flex flex-col  cursor-pointer`}
      onClick={() => navigate(`/sql/${database.id}`)}
    >
      <div className="flex items-start justify-between mb-3 ">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Database className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {database.title}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getDifficultyColor(
            database.difficulty
          )}`}
        >
          {database.difficulty}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3 text-sm">
        <div className="flex items-center gap-1 text-yellow-800">
          <Star className="w-4 h-4 fill-current" />
          {/* <span className="font-semibold">{database.rating}</span> */}
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>50 questions</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
        {database.description}
      </p>

      <div className="flex items-start gap-2 mt-auto">
        <Tag className="w-3 h-3 text-blue-800 mt-1 flex-shrink-0" />
        <div className="flex flex-wrap gap-1">
          {database.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

// --------------------------------------------
export default function DatabaseGrid() {
  // HOOKS
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useSelector((state) => state.theme);

  // STATES
  const [databases, setDatabases] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const itemsPerPage = 6;
  const search = searchParams.get("search") || "";

  // USEFFECT : Load Databases
  useEffect(() => {
    const payload = {
      page: currentPage - 1,
      size: itemsPerPage,
      search: search,
    };

    loadSQLDatasets(payload).then((res) => {
      if (res.success) {
        setDatabases(res.data.items || []);
        setTotalItems(res.data.totalElements || 0);
      }
    });
  }, [currentPage, search]);

  // FUNCTION: HANDLE PAGINATION AND CHANGES
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({
      page: page,
      search: search,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // USEMEMO: Memoized Databases
  const currentDatabases = useMemo(() => {
    return databases;
  }, [databases]);

  return (
    <div
      className={`min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Database Learning Paths
          </h1>
          <p className="text-gray-600">
            Explore our comprehensive database courses and challenges
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDatabases.map((database) => (
            <DatabaseCard key={database.id} database={database} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
