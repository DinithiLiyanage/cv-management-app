import React, { useState } from "react";

export default function JobSearchBar({ onSearch }) {
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
        className="flex-1 px-3 py-2 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 text-white bg-gray-800 placeholder-gray-400 focus:border-teal-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded border-0 bg-teal-500 hover:bg-teal-600 text-white font-bold cursor-pointer transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
}
