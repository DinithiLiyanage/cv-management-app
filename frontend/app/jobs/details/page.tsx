"use client";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Bookmark from "@mui/icons-material/Bookmark";
import React, { useEffect } from "react";
import { Button } from "@mui/material";

type JobDetailsPageProps = {
    title: string;
    company: string;
    location: string;
    salary_max: number;
    salary_min: number;
    description: string;
    category: string;
    url: string;
};

export default function JobDetailsPage() {
    const [isLoading, setLoading] = React.useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [job, setJob] = React.useState<JobDetailsPageProps | null>(null);
    const [isSaved, setIsSaved] = React.useState(
        searchParams.get("isSaved") === "true"
    );

    useEffect(() => {
        // Fetch job details from backend using the id if needed
        setLoading(true);
        console.log("Fetching job...");
        fetch(`http://localhost:3001/api/jobs/${id}`)
            .then((res) => res.json())
            .then((job) => {
                // Adzuna API returns jobs in data.results
                console.log("Job fetched:", job);
                setJob(job);
                setLoading(false);
            })
            .catch(() => {
                setJob(null);
                setLoading(false);
            });
    }, [id]);

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
                    <h1 className="text-3xl text-[#0090D9] font-bold mb-2">
                        {job?.title}
                    </h1>
                    <button
                        className="bg-transparent text-[#0090D9] text-xl border-0 rounded p-1 cursor-pointer self-end hover:bg-black/10 transition-colors"
                        onClick={handleBookMark}
                    >
                        {isSaved ? <Bookmark /> : <BookmarkBorder />}
                    </button>
                </div>
                <p className="text-xl text-gray-700 mb-1">{job?.company}</p>
                <p className="text-lg text-gray-700 mb-4">{job?.location}</p>
                <div className="flex gap-2 mb-4">
                    <span className="bg-[#E6F7FF] text-[#0090D9] px-2 py-1 rounded text-sm">
                        {job?.category}
                    </span>
                </div>
                <div className="space-y-6 mt-4 mb-4">
                    <span className="font-semibold text-[#0090D9]">Salary: </span>
                    <span className="text-gray-600 text-base">
                        {job?.salary_min !== undefined &&
                        job?.salary_max !== undefined
                            ? `$${Math.round(
                                  job.salary_min / 1000
                              )}K - $${Math.round(job.salary_max / 1000)}K`
                            : "Not specified"}
                    </span>
                </div>

                <div>
                    <span className="font-semibold text-[#0090D9]">
                        Description:
                    </span>
                    <p className="mt-2 text-gray-800 text-base">
                        {job?.description || "No description provided."}
                    </p>
                </div>
                <div className="flex justify-end mt-8">
                    <Button
                        className="px-10 flex justify-center bg-[#0090D9] hover:bg-[#0090D9] text-white"
                        variant="contained"
                    >
                        {job?.url ? (
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Apply Now
                            </a>
                        ) : (
                            "Can't Apply Now"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
