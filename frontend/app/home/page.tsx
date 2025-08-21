"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useRouter } from "next/navigation";
import JobDetailCard from "../../components/JobDetailCard";
import JobSearchBar from "../../components/SearchBar";

export default function Home() {
  const { userData, logout } = useAuth();
  const router = useRouter();
  type Job = {
    id?: string | number;
    title: string;
    company: string;
    location: string;
    category: string;
    salary_min: number;
    salary_max: number;
  };

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, jobs]);

  interface SearchBarProps {
    onSearch: (query: string) => void;
  }

  const handleSearch = (query: string) => setSearchQuery(query);

  useEffect(() => {
    setLoading(true);
    console.log("Fetching jobs...");
    fetch("http://localhost:3001/api/jobs")
      .then((res) => res.json())
      .then((jobs) => {
        // Adzuna API returns jobs in data.results
        console.log("Jobs fetched:", jobs);
        setJobs(jobs);
        setLoading(false);
      })
      .catch(() => {
        setJobs([]);
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const formatSalary = (min: number, max: number) => {
    const format = (val: number) => `$${Math.round(val / 1000)}K`;
    return `${format(min)} – ${format(max)}`;
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-semibold">
            Loading jobs...
          </h2>
        </div>
      ) : (
        <div className="w-full h-full">
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-[#E6F7FF] to-[#B8E7FF] px-5 py-8">
            <div className="flex items-center">
              <img
                src="/logo-sign.png"
                alt="ApplyX Logo"
                width={40}
                height={40}
                className="mr-3"
                style={{ objectFit: "contain" }}
              />
              <h3 className="text-xl text-black tracking-tight">
                Welcome back, {userData?.name}
              </h3>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#0090D9] hover:bg-[#007bb5] text-white text-sm font-medium py-2 px-6 rounded transition-colors duration-200 flex-shrink-0"
            >
              Logout
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-10 font-sans flex flex-col gap-10">
            <h1 className="text-3xl font-bold text-black">Job Listings</h1>

            <JobSearchBar onSearch={handleSearch} />

            {/* Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {(searchQuery ? filteredJobs : jobs).length === 0 && (
                <div className="col-span-full">
                  <p className="text-[#0090D9] text-lg">No jobs found.</p>
                </div>
              )}
              {(searchQuery ? filteredJobs : jobs).map((job, idx) => (
                <JobDetailCard
                  key={job.id || idx}
                  position={job.title}
                  company={job.company || "Unknown"}
                  location={job.location || "Unknown"}
                  tags={job.category ? [job.category] : []}
                  salary={
                    job.salary_min && job.salary_max
                      ? formatSalary(job.salary_min, job.salary_max)
                      : "Not specified"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
