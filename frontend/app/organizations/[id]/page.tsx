"use client";

import Header from "@/components/Header";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Business, Work, Add, LocationOn } from "@mui/icons-material";
import { InternalJob, JOB_CATEGORIES } from "../../../types/job";
import JobDetailCard from "@/components/JobDetailCard";

export default function OrganizationDetailPage() {
    const params = useParams();
    const [token, setToken] = React.useState<string | null>(null);
    const [org, setOrg] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [showCreateVacancyModal, setShowCreateVacancyModal] =
        useState<boolean>(false);
    const [newVacancy, setNewVacancy] = useState<any>({});
    const [internalJobs, setInternalJobs] = useState<InternalJob[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user_data");
            if (!userData) {
                window.location.href = "/login";
            } else {
                const parsedData = JSON.parse(userData);
                if (!parsedData.userToken) {
                    window.location.href = "/login";
                }
                setToken(parsedData.userToken);
            }
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchOrganizationDetails();
        }
    }, [params.id, token]);

    const fetchOrganizationDetails = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/api/organizations/${params.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (!response.ok) {
                throw new Error("Failed to fetch organization details");
            }
            const data = await response.json();
            console.log("Fetched Data:", data);
            setOrg(data.organization);
            setIsAdmin(data.role === "admin");

            const responseJobs = await fetch(
                `http://localhost:3001/api/jobs/${params.id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const jobsData = await responseJobs.json();
            setInternalJobs(jobsData || []);
            console.log("Internal Jobs:", jobsData);
        } catch (error) {
            console.error("Error fetching organization details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVacancy = async () => {
        try {
            if (
                !newVacancy.title ||
                !newVacancy.location ||
                !newVacancy.description
            ) {
                alert("Please fill in all required fields");
                return;
            }

            const vacancyData = {
                orgId: params.id,
                company: org.name,
                title: newVacancy.title,
                location: newVacancy.location,
                category: newVacancy.category,
                description: newVacancy.description,
                // Convert textarea strings to arrays by splitting on newlines
                requirements: newVacancy.requirements
                    ? (newVacancy.requirements as any)
                          .split("\n")
                          .filter((line: string) => line.trim())
                    : [],
                responsibilities: newVacancy.responsibilities
                    ? (newVacancy.responsibilities as any)
                          .split("\n")
                          .filter((line: string) => line.trim())
                    : [],
                benefits: newVacancy.benefits
                    ? (newVacancy.benefits as any)
                          .split("\n")
                          .filter((line: string) => line.trim())
                    : [],
                salary_min: newVacancy.salary_min || 0,
                salary_max: newVacancy.salary_max || 0,
                jobType:
                    ((newVacancy.jobType as any) || []).length > 0
                        ? (newVacancy.jobType as any)[0]
                        : "full_time",
                deadline: newVacancy.deadline,
            };

            const response = await fetch(`http://localhost:3001/api/jobs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(vacancyData),
            });

            if (!response.ok) {
                throw new Error("Failed to create vacancy");
            }

            const data = await response.json();
            console.log("Vacancy created:", data);
            alert("Vacancy created successfully!");
            setShowCreateVacancyModal(false);
            setNewVacancy({});
            // Refresh organization details to show new vacancy
            fetchOrganizationDetails();
        } catch (error) {
            console.error("Error adding vacancy:", error);
            alert("Failed to create vacancy. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="w-full h-full">
                <div className="min-h-screen">
                    <Header />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0090D9] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!org) {
        return (
            <div className="w-full h-full">
                <div className="min-h-screen">
                    <Header />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Business className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Organization not found
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <div className="min-h-screen">
                <Header />

                {org && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {/* Organization Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="w-12 h-12 bg-[#0090D9] rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 mb-4">
                                        {org.logo ? (
                                            <img
                                                src={org.logo}
                                                alt={org.name}
                                                className="w-full h-full rounded-lg object-cover"
                                            />
                                        ) : (
                                            org.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                        {org.name}
                                    </h1>
                                    <p className="text-gray-600 text-base mb-4">
                                        {org.description}
                                    </p>

                                    <p className="text-gray-600 text-base font-bold mb-2">
                                        Location: {org.location}
                                    </p>

                                    <p className="text-gray-600 text-base font-bold mb-2">
                                        Industry: {org.industry}
                                    </p>

                                    <p className="text-gray-600 text-base font-bold mb-2">
                                        Staff: {org.memberCount} members
                                    </p>
                                </div>
                            </div>

                            {/* Vacancies Section */}
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Open Positions
                            </h2>
                            {isAdmin && (
                                <button
                                    onClick={() =>
                                        setShowCreateVacancyModal(true)
                                    }
                                    className="flex items-center px-4 py-2 bg-[#0090D9] text-white text-base rounded-lg hover:bg-[#007bb5] ml-auto mb-4"
                                >
                                    <Add className="w-3 h-3 mr-2" />
                                    Add Vacancy
                                </button>
                            )}
                            {/* List vacancies here */}
                            {internalJobs.length == 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Work className="w-12 h-12 mx-auto mb-2" />
                                    <p>No vacancies posted yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {internalJobs.map((job) => (
                                        <JobDetailCard
                                            key={job._id}
                                            id={job._id}
                                            position={job.title}
                                            company={job.company || org.name}
                                            location={
                                                job.location || "Not specified"
                                            }
                                            tags={[job.category]}
                                            salary={
                                                job.salary_min && job.salary_max
                                                    ? `$${Math.round(job.salary_min / 1000)}K - $${Math.round(job.salary_max / 1000)}K`
                                                    : "Not specified"
                                            }
                                            source={job.source}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {showCreateVacancyModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                                Create New Vacancy
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newVacancy.title || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        placeholder="e.g., Senior Software Engineer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={newVacancy.location || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        placeholder="e.g., San Francisco, CA or Remote"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={newVacancy.category || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                category: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {JOB_CATEGORIES.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Type
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            {
                                                value: "full_time",
                                                label: "Full Time",
                                            },
                                            {
                                                value: "part_time",
                                                label: "Part Time",
                                            },
                                            {
                                                value: "contract",
                                                label: "Contract",
                                            },
                                            {
                                                value: "permanent",
                                                label: "Permanent",
                                            },
                                            {
                                                value: "internship",
                                                label: "Internship",
                                            },
                                        ].map((type) => (
                                            <label
                                                key={type.value}
                                                className="flex items-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={(
                                                        (newVacancy.jobType as any) ||
                                                        []
                                                    ).includes(type.value)}
                                                    onChange={(e) => {
                                                        const currentTypes =
                                                            (newVacancy.jobType as any) ||
                                                            [];
                                                        const newTypes = e
                                                            .target.checked
                                                            ? [
                                                                  ...currentTypes,
                                                                  type.value,
                                                              ]
                                                            : currentTypes.filter(
                                                                  (t: string) =>
                                                                      t !==
                                                                      type.value,
                                                              );
                                                        setNewVacancy({
                                                            ...newVacancy,
                                                            jobType: newTypes,
                                                        });
                                                    }}
                                                    className="w-4 h-4 text-[#0090D9] border-gray-300 rounded focus:ring-[#0090D9]"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    {type.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={newVacancy.salary_min || ""}
                                            onChange={(e) =>
                                                setNewVacancy({
                                                    ...newVacancy,
                                                    salary_min: parseInt(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={newVacancy.salary_max || ""}
                                            onChange={(e) =>
                                                setNewVacancy({
                                                    ...newVacancy,
                                                    salary_max: parseInt(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                            placeholder="80000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="date"
                                        value={
                                            newVacancy.deadline
                                                ? typeof newVacancy.deadline ===
                                                  "string"
                                                    ? newVacancy.deadline
                                                    : new Date(
                                                          newVacancy.deadline,
                                                      )
                                                          .toISOString()
                                                          .split("T")[0]
                                                : new Date()
                                                      .toISOString()
                                                      .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                deadline: new Date(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={newVacancy.description || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        rows={4}
                                        placeholder="Describe the position..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Requirements
                                    </label>
                                    <textarea
                                        value={newVacancy.requirements || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                requirements: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        rows={3}
                                        placeholder="List the requirements (one per line)..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Responsibilities
                                    </label>
                                    <textarea
                                        value={
                                            newVacancy.responsibilities || ""
                                        }
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                responsibilities:
                                                    e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        rows={3}
                                        placeholder="List the key responsibilities..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Benefits
                                    </label>
                                    <textarea
                                        value={newVacancy.benefits || ""}
                                        onChange={(e) =>
                                            setNewVacancy({
                                                ...newVacancy,
                                                benefits: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        rows={3}
                                        placeholder="List the benefits offered..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowCreateVacancyModal(false);
                                        setNewVacancy({});
                                    }}
                                    className="flex-1 px-4 py-2 text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddVacancy}
                                    className="flex-1 px-4 py-2 text-base bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors"
                                >
                                    Create Vacancy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
