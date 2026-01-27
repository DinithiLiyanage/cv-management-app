"use client";
import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Bookmark from "@mui/icons-material/Bookmark";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { InternalJob, Job } from "@/types/job";

type JobDetailsType = Job | InternalJob;

export default function JobDetailsPage() {
    const [isLoading, setLoading] = React.useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const source = searchParams.get("source"); // "external" or "internal"
    const [job, setJob] = React.useState<JobDetailsType | null>(null);
    const [isSaved, setIsSaved] = React.useState(
        searchParams.get("isSaved") === "true",
    );
    const [token, setToken] = React.useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user_data");
            if (userData) {
                const parsedData = JSON.parse(userData);
                setToken(parsedData.userToken);
            }
        }
    }, []);

    useEffect(() => {
        if (!id || !token) return;

        setLoading(true);
        console.log("Fetching job...");

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };

        if (token && source === "internal") {
            headers["authorization"] = `Bearer ${token}`;
        }

        fetch(`http://localhost:3001/api/jobs/${source}/${id}`, { headers })
            .then((res) => res.json())
            .then((job) => {
                console.log("Job fetched:", job);
                setJob(job);
                setLoading(false);
            })
            .catch(() => {
                setJob(null);
                setLoading(false);
            });
    }, [id, token, source]);

    const handleBookMark = () => {
        const newIsSaved = !isSaved;
        setIsSaved(newIsSaved);
    };

    const isInternalJob = (job: JobDetailsType | null): job is InternalJob => {
        return job !== null && (job as InternalJob).source === "internal";
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0090D9] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen">
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
                <p className="text-lg text-gray-700 mb-1">
                    {job?.company}, {job?.location}
                </p>
                <div className="mb-6">
                    <span className="font-semibold text-[#0090D9] text-lg">
                        Category: {" "}
                    </span>
                    <span className="mt-2 text-gray-800 text-base">
                        {job?.category || "No category provided."}
                    </span>
                </div>

                <div className="flex gap-2 mb-4">
                    {job && isInternalJob(job) && (
                        <>
                            {job.jobType &&
                                (Array.isArray(job.jobType)
                                    ? job.jobType
                                    : [job.jobType]
                                ).map((type) => (
                                    <span
                                        key={type}
                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
                                    >
                                        {type.replace("_", " ")}
                                    </span>
                                ))}
                        </>
                    )}
                </div>

                <div className="space-y-2 mt-2 mb-2">
                    <div>
                        <span className="font-semibold text-[#0090D9] text-lg">
                            Salary:{" "}
                        </span>
                        <span className="text-gray-600 text-base">
                            {job?.salary_min !== undefined &&
                            job?.salary_max !== undefined
                                ? `$${Math.round(
                                      job.salary_min / 1000,
                                  )}K - $${Math.round(job.salary_max / 1000)}K`
                                : "Not specified"}
                        </span>
                    </div>

                    {job && isInternalJob(job) && job.deadline && (
                        <div>
                            <span className="font-semibold text-[#0090D9] text-lg">
                                Application Deadline:{" "}
                            </span>
                            <span className="text-gray-600 text-base">
                                {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <span className="font-semibold text-[#0090D9] text-lg">
                        Description:
                    </span>
                    <p className="mt-2 text-gray-800 text-base">
                        {job?.description || "No description provided."}
                    </p>
                </div>

                {job && isInternalJob(job) && (
                    <>
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-6">
                                <span className="font-semibold text-[#0090D9] text-lg">
                                    Requirements:
                                </span>
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                    {job.requirements.map((req, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-800 text-base"
                                        >
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {job.responsibilities &&
                            job.responsibilities.length > 0 && (
                                <div className="mb-6">
                                    <span className="font-semibold text-[#0090D9] text-lg">
                                        Responsibilities:
                                    </span>
                                    <ul className="mt-2 list-disc list-inside space-y-1">
                                        {job.responsibilities.map(
                                            (resp, index) => (
                                                <li
                                                    key={index}
                                                    className="text-gray-800 text-base"
                                                >
                                                    {resp}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                        {job.benefits && job.benefits.length > 0 && (
                            <div className="mb-6">
                                <span className="font-semibold text-[#0090D9] text-lg">
                                    Benefits:
                                </span>
                                <ul className="mt-2 list-disc list-inside space-y-1">
                                    {job.benefits.map((benefit, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-800 text-base"
                                        >
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-end mt-8">
                    <Button
                        className="px-10 flex justify-center bg-[#0090D9] hover:bg-[#0090D9] text-white"
                        variant="contained"
                    >
                        {job && !isInternalJob(job) && job.url ? (
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Apply Now
                            </a>
                        ) : isInternalJob(job as JobDetailsType) ? (
                            "Apply Now"
                        ) : (
                            "Can't Apply Now"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
