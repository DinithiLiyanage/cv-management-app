import React from "react";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Bookmark from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";

const JobDetailCard = ({ position, company, location, tags, salary }) => {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleBookMark = () => {
    const newIsSaved = !isSaved; // Toggle the state
    setIsSaved(newIsSaved); // Update the state
  };

  return (
    <div className="p-4 w-[300px] shadow-md font-sans text-black bg-[#E6F7FF] rounded-lg flex flex-col h-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <BusinessIcon className="text-black" />
        <div className="flex-1" />
        <button
          className="bg-transparent text-black border-0 rounded p-1 cursor-pointer self-end hover:bg-black/10 transition-colors"
          onClick={handleBookMark}
        >
          {isSaved ? <Bookmark /> : <BookmarkBorder />}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1">
        <h3 className="m-0 mb-2 text-lg font-bold">{position}</h3>
        <p className="m-0 mb-4 text-left text-sm">
          {company}
          <br />
          {location}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end mt-0">
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-[#0090D9] rounded px-2 py-1 text-xs text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm">{salary}</p>
      </div>
    </div>
  );
};

export default JobDetailCard;
