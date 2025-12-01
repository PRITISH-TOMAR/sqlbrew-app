// REACT IMPORTS

// IMPORTS
import { useSelector } from "react-redux";

// UTILITIES
import { LockClosedIcon, StarIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "lucide-react";

function ProblemGridRow({ index, item }) {
  const theme = useSelector((state) => state.theme);

  const levelStyle = {
    easy: "text-green-400",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  return (
    <div
      className={`grid py-3 px-4 cursor-pointer transition min-w-max
        ${theme === "dark" ? "hover:bg-[#222]" : "hover:bg-gray-50"}`}
      style={{
        gridTemplateColumns: "60px minmax(300px, 1fr) 120px 200px 60px",
      }}
    >
      <div className="flex items-center">{index}</div>

      <div className="flex items-center gap-2 min-w-0">
        <span className="truncate">{item.title}</span>
        {item.locked && (
          <LockClosedIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </div>

      <div
        className={`flex items-center font-medium ${
          levelStyle[item.difficulty.toLowerCase()]
        }`}
      >
        {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
      </div>

      <div className="flex items-center text-sm text-gray-400 truncate">
        {<BookmarkIcon />}
      </div>

      <div className="flex items-center justify-end">
        <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
      </div>
    </div>
  );
}

export default ProblemGridRow;
