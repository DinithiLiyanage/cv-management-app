import { FilterAlt, FilterAltOff } from "@mui/icons-material";
import React, { useState } from "react";

export default function JobSearchBar({ onSearch , onToggleSidebar , sidebarVisible }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-5 w-full max-w-[500px]"
    >
      <input
        type="text"
        placeholder="Search jobs by title, company, or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-3 py-2 rounded  text-base focus:outline-none focus:ring-2 border border-gray-300 focus:ring-teal-500 text-black placeholder-gray-400 focus:border-teal-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-[#0090D9] hover:bg-[#007bb5] text-white text-sm cursor-pointer">
        Search
      </button>
      <button
        type="button"
        onClick={onToggleSidebar}
        className="px-2 py-2 rounded bg-[#0090D9] hover:bg-[#007bb5] text-white text-sm cursor-pointer">
        <span className="">{sidebarVisible ? <FilterAlt /> : <FilterAltOff />}</span>
      </button>
    </form>
  );
}
