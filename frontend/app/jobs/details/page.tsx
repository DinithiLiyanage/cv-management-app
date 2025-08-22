"use client";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Bookmark from "@mui/icons-material/Bookmark";
import React from "react";

export default function JobDetailsPage() {
  const searchParams = useSearchParams();
  const position = searchParams.get("position");
  const company = searchParams.get("company");
  const location = searchParams.get("location");
  const salary = searchParams.get("salary");
  const description = searchParams.get("description");
  const tags = searchParams.get("tags")?.split(",") || [];
  const [isSaved, setIsSaved] = React.useState(
    searchParams.get("isSaved") === "true"
  );

  const handleBookMark = () => {
    const newIsSaved = !isSaved; // Toggle the state
    setIsSaved(newIsSaved); // Update the state
  };

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <Header />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8 mt-10 mb-20">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl text-[#0090D9] font-bold mb-2">{position}</h1>
          <button
            className="bg-transparent text-[#0090D9] text-xl border-0 rounded p-1 cursor-pointer self-end hover:bg-black/10 transition-colors"
            onClick={handleBookMark}
          >
            {isSaved ? <Bookmark /> : <BookmarkBorder />}
          </button>
        </div>
        <p className="text-xl text-gray-700 mb-1">{company}</p>
        <p className="text-lg text-gray-700 mb-4">{location}</p>
        <div className="flex gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#E6F7FF] text-[#0090D9] px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-[#0090D9] mb-4 font-semibold">Salary: {salary}</p>
        <div>
          <span className="font-semibold text-[#0090D9]">Description:</span>
          <p className="mt-2 text-gray-800 text-md">
            {description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
