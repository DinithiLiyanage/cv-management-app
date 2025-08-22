"use client";

import React, { useEffect, useState } from "react";
import JobDetailCard from "../../components/JobDetailCard";
import JobSearchBar from "../../components/SearchBar";
import JobFilterSidebar from "../../components/JobFilterSidebar";
import Header from "../../components/Header";

type Job = {
  id?: string | number;
  title: string;
  company: string;
  location: string;
  category: string;
  salary_min: number;
  salary_max: number;
  description?: string;
};

// Sidebar filter handler
type SidebarFilters = {
  what?: string[];
  country?: string;
  category?: string;
  salary_min?: number | string;
  salary_max?: number | string;
  full_time: string;
  part_time: string;
  contract: string;
  permanent: string;
};

export default function Home() {
  

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SidebarFilters | undefined>(undefined);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleSidebarFilter = (filters: SidebarFilters) => {
    setFilters(filters);
  };

  // Fetch filtered jobs when filters change
  useEffect(() => {
    // Optionally, skip fetch if filters are not set
    if (!filters) return;
    console.log("Fetching jobs with filters:", filters);
    fetch("http://localhost:3001/api/jobs/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    })
      .then((res) => res.json())
      .then((jobs) => {
        setFilteredJobs(jobs);
        console.log("Filtered jobs fetched:", filteredJobs);
        setLoading(false);
      })
      .catch(() => {
        setFilteredJobs([]);
        setLoading(false);
      });
  }, [filters]);

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

  const formatSalary = (min: number, max: number) => {
    const format = (val: number) => `$${Math.round(val / 1000)}K`;
    return `${format(min)} – ${format(max)}`;
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-semibold">Loading jobs...</h2>
        </div>
      ) : (
        <div className="w-full h-full">
          {/* Header */}
          <Header />

          {/* Body */}
          <div className="flex gap-8 px-5 py-10">
            {/* Sidebar */}
            {sidebarVisible && (
              <JobFilterSidebar onFilter={handleSidebarFilter} />
            )}

            {/* Job Cards */}
            <div className="flex-1 font-sans flex flex-col gap-10">
              <h1 className="text-3xl font-bold text-black">Job Listings</h1>
              <JobSearchBar
                onSearch={handleSearch}
                onToggleSidebar={() => setSidebarVisible((v) => !v)}
                sidebarVisible={sidebarVisible}
              />
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                {(filters || searchQuery ? filteredJobs : jobs).length ===
                  0 && (
                  <div className="col-span-full">
                    <p className="text-[#0090D9] text-lg">No jobs found.</p>
                  </div>
                )}
                {(filters || searchQuery ? filteredJobs : jobs).map(
                  (job, idx) => (
                    <JobDetailCard
                      key={job.id || idx}
                      position={job.title}
                      company={job.company || "Unknown"}
                      location={job.location || "Unknown"}
                      tags={job.category ? [job.category] : []}
                      description={job.description || "No description available"}
                      salary={
                        job.salary_min && job.salary_max
                          ? formatSalary(job.salary_min, job.salary_max)
                          : "Not specified"
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
