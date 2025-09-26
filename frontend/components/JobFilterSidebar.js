"use client";
import { useState } from "react";

const initialFilters = {
  what: "",
  country: "",
  category: "",
  salary_min: "",
  salary_max: "",
  full_time: "0",
  part_time: "0",
  contract: "0",
  permanent: "0",
};

export default function JobFilterSidebar({ onFilter }) {
  const [filters, setFilters] = useState({
    what: "",
    country: "",
    category: "",
    salary_min: "",
    salary_max: "",
    full_time: "0",
    part_time: "0",
    contract: "0",
    permanent: "0",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const applyFilters = () => {
    // Pass filters to parent (page component)
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  return (
    <div className="w-72 bg-white text-black shadow-md rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>

      {/* Keywords */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Keywords</label>
        <input
          type="text"
          name="what"
          value={filters.what}
          onChange={handleChange}
          className="w-full border border-gray-300 text-sm rounded-md p-2 mt-1"
          placeholder="Software Engineer"
        />
      </div>

      {/* Location */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Country</label>
        <select
          name="country"
          value={filters.where}
          onChange={handleChange}
          className="w-full border border-gray-300 text-sm rounded-md p-2 mt-1"
        >
          <option value="us">United States of America</option>
          <option value="gb">United Kingdom</option>
          <option value="at">Austria</option>
          <option value="au">Australia</option>
          <option value="be">Belgium</option>
          <option value="br">Brazil</option>
          <option value="ca">Canada</option>
          <option value="ch">Switzerland</option>
          <option value="de">Germany</option>
          <option value="es">Spain</option>
          <option value="fr">France</option>
          <option value="in">India</option>
          <option value="it">Italy</option>
          <option value="mx">Mexico</option>
          <option value="nl">Netherlands</option>
          <option value="nz">New Zealand</option>
          <option value="pl">Poland</option>
          <option value="sg">Singapore</option>
          <option value="za">South Africa</option>
        </select>
      </div>

      {/* Category */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Category</label>
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full border border-gray-300 text-sm rounded-md p-2 mt-1"
        >
          <option value="">All Categories</option>
          <option value="it-jobs">IT</option>
          <option value="engineering-jobs">Engineering</option>
          <option value="accounting-finance-jobs">Finance</option>
          <option value="sales-jobs">Sales</option>
          <option value="pr-advertising-marketing-jobs">Marketing</option>
          <option value="teaching-jobs">Education</option>
          <option value="healthcare-nursing-jobs">Healthcare</option>
          <option value="hospitality-catering-jobs">Hospitality</option>
        </select>
      </div>

      {/* Salary Range */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Salary Range (£)</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="salary_min"
            value={filters.salary_min}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 text-sm rounded-md p-2 mt-1"
            placeholder="Min"
          />
          <input
            type="number"
            name="salary_max"
            value={filters.salary_max}
            onChange={handleChange}
            className="w-1/2 border border-gray-300 text-sm rounded-md p-2 mt-1"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Job Type</label>
        <div className="flex flex-col gap-1 mt-1 text-sm">
          <label>
            <input
              type="checkbox"
              name="full_time"
              checked={filters.full_time == "1"}
              onChange={handleChange}
            />{" "}
            Full Time
          </label>
          <label>
            <input
              type="checkbox"
              name="part_time"
              checked={filters.part_time == "1"}
              onChange={handleChange}
            />{" "}
            Part Time
          </label>
          <label>
            <input
              type="checkbox"
              name="contract"
              checked={filters.contract == "1"}
              onChange={handleChange}
            />{" "}
            Contract
          </label>
          <label>
            <input
              type="checkbox"
              name="permanent"
              checked={filters.permanent == "1"}
              onChange={handleChange}
            />{" "}
            Permanent
          </label>
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-[#0090D9] text-white text-sm py-2 rounded-md mt-4 hover:bg-[#0077b6]"
      >
        Apply Filters
      </button>
      <button
        onClick={resetFilters}
        className="w-full bg-gray-200 text-gray-800 text-sm py-2 rounded-md mt-2 hover:bg-gray-300"
      >
        Reset Filters
      </button>
    </div>
  );
}


