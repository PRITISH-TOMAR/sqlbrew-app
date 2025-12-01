import React from "react";
import { useSelector } from "react-redux";
import { themeClasses } from "../../utils/classes/themeClasses";

const DatabaseBar = ({ database }) => {
  const theme = useSelector((state) => state.theme);
  

  return (
    <div
      className={`hidden lg:block w-full h-full border-l p-5 shadow-lg
      ${themeClasses[theme].bg} ${themeClasses[theme].text}`}
      data
    >
      {/* Title */}
      <h2 className="text-xl font-bold mb-2">{database.title}</h2>

      {/* Difficulty */}
      <div className="mb-4">
        <span className="text-sm font-semibold">Difficulty:</span>
        <span
          className={`ml-2 px-2 py-1 rounded text-xs ${
            database.difficulty === "easy"
              ? "bg-green-500/20 text-green-500"
              : database.difficulty === "med"
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {database.difficulty}
        </span>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {database.tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-gray-300/20 rounded text-xs border border-gray-500/20"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      {database.notes && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Notes</h3>
          <p className="text-sm opacity-90">{database.notes}</p>
        </div>
      )}

      {/* Created At */}
      <div className="text-xs opacity-60 mt-6">
        Created At: {new Date(database.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default DatabaseBar;
