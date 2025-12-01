// REACT MODULES
import { useSelector } from "react-redux";

// IMPORTS
import ProblemGridRow from "../../utils/helpers/ProblemGridRow";

// UTILITIES

export default function ProblemsList({ items }) {
  const theme = useSelector((state) => state.theme);

  return (
    <div
      className={` p-2 rounded-lg overflow-hidden w-full h-full  shadow-md 
      ${
        theme === "dark" ? "bg-[#111]" : "bg-white"
      } overflow-x-auto whitespace-nowrap`}
    >
      {/* Header */}
      <div
        className={`grid py-3 px-4 font-semibold border-b min-w-max
    ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
        style={{
          gridTemplateColumns: "60px minmax(300px, 1fr) 120px 200px 60px",
        }}
      >
        <div className="flex items-center">#</div>
        <div className="flex items-center">Title</div>
        <div className="flex items-center">Level</div>
        <div className="flex items-center">Notes</div>
        <div className="flex items-center justify-end">⋮</div>
      </div>

      {/* Rows */}
      {items.length > 0 &&
        items.map((item, idx) => (
          <ProblemGridRow key={item?.id} index={idx + 1} item={item} />
        ))}
    </div>
  );
}
