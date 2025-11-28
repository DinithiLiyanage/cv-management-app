"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authContext";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import {
    Business,
    Add,
    Search,
    LocationOn,
    People,
    Send,
    Check,
    Pending,
    Star,
} from "@mui/icons-material";
import { Organization, INDUSTRY_OPTIONS } from "../../types";

export default function OrganizationsPage() {
    const { userData } = useAuth();
    const params = useParams();
    const [myOrganizations, setMyOrganizations] = useState<Organization[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newOrg, setNewOrg] = useState({
        name: "",
        description: "",
        location: "",
        industry: "",
        logo: "",
    });

    useEffect(() => {
        fetchMyOrganizations();
    }, []);

    const fetchMyOrganizations = async () => {
        try {
            setLoading(true);

            // TODO: Replace with actual API call to get user's organizations
            const mockMyOrganizations: Organization[] = [
                {
                    id: "1",
                    name: "TechCorp Solutions",
                    description:
                        "Leading technology company where I work as a Software Engineer.",
                    location: "San Francisco, CA",
                    industry: "Technology",
                    memberCount: 1250,
                    isVerified: true,
                    membershipStatus: "member",
                },
                {
                    id: "2",
                    name: "Green Energy Ltd",
                    description:
                        "Sustainable energy solutions - my current workplace.",
                    location: "Austin, TX",
                    industry: "Energy",
                    memberCount: 850,
                    isVerified: true,
                    membershipStatus: "member",
                },
                {
                    id: "3",
                    name: "StartupHub Inc",
                    description:
                        "Applied for a position here - awaiting response.",
                    location: "New York, NY",
                    industry: "Consulting",
                    memberCount: 450,
                    isVerified: false,
                    membershipStatus: "pending",
                },
            ];
            setMyOrganizations(mockMyOrganizations);
        } catch (error) {
            console.error("Error fetching my organizations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrganization = async () => {
        try {
            if (
                !newOrg.name ||
                !newOrg.description ||
                !newOrg.location ||
                !newOrg.industry
            ) {
                alert("Please fill in all required fields");
                return;
            }

            const organization: Organization = {
                id: Date.now().toString(),
                name: newOrg.name,
                description: newOrg.description,
                location: newOrg.location,
                industry: newOrg.industry,
                memberCount: 1,
                isVerified: false,
                membershipStatus: "member",
            };

            // TODO: Replace with actual API call
            setMyOrganizations((prev) => [organization, ...prev]);
            setShowCreateModal(false);
            setNewOrg({
                name: "",
                description: "",
                location: "",
                industry: "",
                logo: "",
            });
            console.log("Organization created successfully");
        } catch (error) {
            console.error("Error creating organization:", error);
        }
    };

    // Sort organizations: members first, then pending
    const sortedOrganizations = myOrganizations.sort((a, b) => {
        if (a.membershipStatus === "member" && b.membershipStatus !== "member")
            return -1;
        if (a.membershipStatus !== "member" && b.membershipStatus === "member")
            return 1;
        return 0;
    });

    const filteredOrganizations = sortedOrganizations.filter(
        (org) =>
            org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0090D9] mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Loading organizations...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Organizations
                        </h1>
                    </div>

                    {/* Search and Create */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-3 flex justify-center items-center pointer-events-none">
                                <Search className="text-gray-400 w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search your organizations by name, industry, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 text-gray-900 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center px-6 py-3 bg-[#0090D9] text-white text-base rounded-lg hover:bg-[#007bb5] transition-colors whitespace-nowrap"
                        >
                            <Add className="w-5 h-5 mr-2" />
                            Add Organization
                        </button>
                    </div>

                    {/* Organizations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrganizations.map((org) => (
                            <div
                                key={org.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                            >
                                {/* Organization Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-[#0090D9] rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3">
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
                                        <div>
                                            <h3 className="font-semibold text-gray-900 flex items-center">
                                                {org.name}
                                                {org.isVerified && (
                                                    <Star className="w-4 h-4 text-yellow-500 ml-1" />
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {org.industry}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                    {org.description}
                                </p>

                                {/* Location and Members */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <LocationOn className="w-4 h-4 mr-2" />
                                        {org.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <People className="w-4 h-4 mr-2" />
                                        {org.memberCount.toLocaleString()}{" "}
                                        members
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        {org.membershipStatus === "member" ? (
                                            <span className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                                                <Check className="w-4 h-4 mr-1" />
                                                Member
                                            </span>
                                        ) : (
                                            <span className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                                                <Pending className="w-4 h-4 mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    <button className="text-[#0090D9] hover:text-[#007bb5] text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredOrganizations.length === 0 && searchTerm && (
                        <div className="text-center py-12">
                            <Business className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No organizations found
                            </h3>
                            <p className="text-gray-600">
                                Try adjusting your search criteria.
                            </p>
                        </div>
                    )}

                    {/* No Organizations */}
                    {myOrganizations.length === 0 &&
                        !searchTerm &&
                        !loading && (
                            <div className="text-center py-12">
                                <Business className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No organizations yet
                                </h3>
                                <p className="text-gray-600">
                                    You haven't joined any organizations yet.
                                    Add your current workplace or apply to new
                                    organizations.
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-4 flex items-center px-6 py-3 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors mx-auto"
                                >
                                    <Add className="w-5 h-5 mr-2" />
                                    Add Organization
                                </button>
                            </div>
                        )}
                </div>

                {/* Create Organization Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Add New Organization
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Organization Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newOrg.name}
                                        onChange={(e) =>
                                            setNewOrg({
                                                ...newOrg,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        placeholder="Enter organization name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description *
                                    </label>
                                    <textarea
                                        value={newOrg.description}
                                        onChange={(e) =>
                                            setNewOrg({
                                                ...newOrg,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        rows={3}
                                        placeholder="Describe your organization"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={newOrg.location}
                                        onChange={(e) =>
                                            setNewOrg({
                                                ...newOrg,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                        placeholder="City, State/Country"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Industry *
                                    </label>
                                    <select
                                        value={newOrg.industry}
                                        onChange={(e) =>
                                            setNewOrg({
                                                ...newOrg,
                                                industry: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none"
                                    >
                                        {INDUSTRY_OPTIONS.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateOrganization}
                                    className="flex-1 px-4 py-2 text-base bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors"
                                >
                                    Add Organization
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
