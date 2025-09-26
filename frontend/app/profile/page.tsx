"use client";

import React from "react";
import Header from "../../components/Header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Person, Edit, Save, Cancel, PhotoCamera } from "@mui/icons-material";

interface ProfessionalExperience {
    jobTitle?: string;
    company?: string;
    startDate?: string; // ISO string
    endDate?: string; // ISO string
    industry?: string;
}

interface UserProfile {
    name?: string;
    email?: string;
    role?: string;
    // Personal Info
    profilePicture?: string;
    bio?: string;
    location?: string;
    phone?: string;
    // Professional Info
    experiences?: ProfessionalExperience[];
    // Skills
    skills?: string[];
    certifications?: string[];
}

export default function ProfilePage() {
    const params = useParams();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newCertification, setNewCertification] = useState("");
    const [editingExperienceIdx, setEditingExperienceIdx] = useState<
        number | null
    >(null);
    const [newExperience, setNewExperience] = useState({
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        industry: "",
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userId = params.id;
                const response = await fetch(
                    `http://localhost:3001/api/user/profile`
                );
                const data = await response.json();
                setUser(data);
                setEditedUser(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        if (params.id) {
            fetchUserProfile();
        }
    }, [params.id]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser({ ...user });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser({ ...user });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const userId = params.id;
            const response = await fetch(
                `http://localhost:3001/api/user/profile/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedUser),
                }
            );

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof UserProfile, value: any) => {
        setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
    };

    const addSkill = () => {
        if (newSkill.trim() && editedUser) {
            const currentSkills = editedUser.skills || [];
            if (!currentSkills.includes(newSkill.trim())) {
                updateField("skills", [...currentSkills, newSkill.trim()]);
                setNewSkill("");
            }
        }
    };

    const addCertification = () => {
        if (newCertification.trim() && editedUser) {
            const currentCerts = editedUser.certifications || [];
            if (!currentCerts.includes(newCertification.trim())) {
                updateField("certifications", [
                    ...currentCerts,
                    newCertification.trim(),
                ]);
                setNewCertification("");
            }
        }
    };

    const removeSkill = (skill: string) => {
        if (editedUser) {
            updateField(
                "skills",
                (editedUser.skills || []).filter((s) => s !== skill)
            );
        }
    };

    const removeExperience = (index: number) => {
        if (editedUser) {
            const updatedExperiences = (editedUser.experiences || []).filter(
                (_, i) => i !== index
            );
            updateField("experiences", updatedExperiences);
        }
    };

    const removeCertification = (cert: string) => {
        if (editedUser) {
            updateField(
                "certifications",
                (editedUser.certifications || []).filter((c) => c !== cert)
            );
        }
    };

    const ProfileImage = ({
        size = "w-8 h-8",
        showBorder = false,
        editable = false,
    }) => {
        const currentUser = isEditing ? editedUser : user;

        if (currentUser?.profilePicture) {
            return (
                <div className="relative">
                    <img
                        src={currentUser.profilePicture}
                        alt="Profile"
                        className={`${size} rounded-full object-cover ${
                            showBorder ? "border-2 border-[#0090D9]" : ""
                        }`}
                    />
                    {editable && isEditing && (
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0090D9] text-white rounded-full flex items-center justify-center hover:bg-[#007bb5] transition-colors">
                            <PhotoCamera className="text-xs" />
                        </button>
                    )}
                </div>
            );
        }
        return (
            <div className="relative">
                <div
                    className={`${size} rounded-full bg-gray-100 flex items-center justify-center ${
                        showBorder ? "border-2 border-[#0090D9]" : ""
                    }`}
                >
                    <Person
                        className={`text-[#0090D9] ${
                            size === "w-24 h-24" ? "text-4xl" : "text-lg"
                        }`}
                    />
                </div>
                {editable && isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0090D9] text-white rounded-full flex items-center justify-center hover:bg-[#007bb5] transition-colors">
                        <PhotoCamera className="text-xs" />
                    </button>
                )}
            </div>
        );
    };

    const industryOptions = [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Marketing",
        "Sales",
        "Engineering",
        "Design",
        "Operations",
        "Human Resources",
        "Other",
    ];

    if (!user && !editedUser) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0090D9] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentUser = isEditing ? editedUser : user;

    return (
        <div className="h-full w-full">
            <div className="min-h-screen bg-gray-50">
                <Header />

                {/* Profile Content */}
                <main className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-6">
                                <ProfileImage
                                    size="w-24 h-24"
                                    showBorder={true}
                                    editable={true}
                                />
                                <div>
                                    <div className="flex items-center space-x-4">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {currentUser?.name ||
                                                "Name not provided"}
                                        </h1>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {currentUser?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Controls */}
                            <div className="flex space-x-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                        >
                                            <Cancel className="w-4 h-4 mr-2" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center px-2 py-2 bg-[#0090D9] text-white rounded-lg hover:bg-[#007bb5] transition-colors text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="mb-4 mt-10">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={editedUser?.bio || ""}
                                    onChange={(e) =>
                                        updateField("bio", e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                                    {currentUser?.bio || "No bio provided"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Personal Information
                        </h2>

                        {/* Location & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser?.location || ""}
                                        onChange={(e) =>
                                            updateField(
                                                "location",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                                        placeholder="City, Country"
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                                        {currentUser?.location ||
                                            "Not specified"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedUser?.phone || ""}
                                        onChange={(e) =>
                                            updateField("phone", e.target.value)
                                        }
                                        className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                ) : (
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                                        {currentUser?.phone || "Not specified"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Professional Experience
                            </h2>
                            {isEditing && (
                                <button
                                    onClick={() => setEditingExperienceIdx(-1)}
                                    className="px-3 py-1 bg-[#0090D9] text-white rounded-md hover:bg-[#007bb5] text-sm"
                                >
                                    + Add Experience
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                {/* Add New Experience Form */}
                                {editingExperienceIdx === -1 && (
                                    <div className="border border-gray-300 p-4 rounded-lg mb-4">
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Job Title
                                            </label>
                                            <input
                                                type="text"
                                                value={newExperience.jobTitle}
                                                onChange={(e) =>
                                                    setNewExperience({
                                                        ...newExperience,
                                                        jobTitle:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                placeholder="Job Title"
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                value={newExperience.company}
                                                onChange={(e) =>
                                                    setNewExperience({
                                                        ...newExperience,
                                                        company: e.target.value,
                                                    })
                                                }
                                                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                placeholder="Company"
                                            />
                                        </div>
                                        <div className="mb-2 flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="month"
                                                    value={
                                                        newExperience.startDate
                                                    }
                                                    onChange={(e) =>
                                                        setNewExperience({
                                                            ...newExperience,
                                                            startDate:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                    placeholder="Start Date"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    End Date
                                                </label>
                                                <input
                                                    type="month"
                                                    value={
                                                        newExperience.endDate
                                                    }
                                                    onChange={(e) =>
                                                        setNewExperience({
                                                            ...newExperience,
                                                            endDate:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                    placeholder="End Date"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Industry
                                            </label>
                                            <select
                                                value={newExperience.industry}
                                                onChange={(e) =>
                                                    setNewExperience({
                                                        ...newExperience,
                                                        industry:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                            >
                                                <option value="">
                                                    Select Industry
                                                </option>
                                                {industryOptions.map(
                                                    (option) => (
                                                        <option
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                        <div className="flex gap-2 mt-5">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        newExperience.jobTitle &&
                                                        newExperience.company &&
                                                        newExperience.startDate
                                                    ) {
                                                        updateField(
                                                            "experiences",
                                                            [
                                                                ...(editedUser?.experiences ??
                                                                    []),
                                                                newExperience,
                                                            ]
                                                        );
                                                        setNewExperience({
                                                            jobTitle: "",
                                                            company: "",
                                                            startDate: "",
                                                            endDate: "",
                                                            industry: "",
                                                        });
                                                        setEditingExperienceIdx(
                                                            null
                                                        );
                                                    }
                                                }}
                                                className="px-4 py-2 bg-[#0090D9] text-white rounded-md hover:bg-[#007bb5] text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNewExperience({
                                                        jobTitle: "",
                                                        company: "",
                                                        startDate: "",
                                                        endDate: "",
                                                        industry: "",
                                                    });
                                                    setEditingExperienceIdx(
                                                        null
                                                    );
                                                }}
                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* List Experiences */}
                                {(editedUser?.experiences ?? []).map(
                                    (exp, idx) => (
                                        <div
                                            key={idx}
                                            className="border-b pb-4 mb-4"
                                        >
                                            {editingExperienceIdx === idx ? (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="block text-sm text-gray-600 font-medium text-gray-700 mb-1">
                                                            Job Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                exp.jobTitle ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...(editedUser?.experiences ??
                                                                            []),
                                                                    ];
                                                                updated[
                                                                    idx
                                                                ].jobTitle =
                                                                    e.target.value;
                                                                updateField(
                                                                    "experiences",
                                                                    updated
                                                                );
                                                            }}
                                                            className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                            placeholder="Job Title"
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Company
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                exp.company ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...(editedUser?.experiences ??
                                                                            []),
                                                                    ];
                                                                updated[
                                                                    idx
                                                                ].company =
                                                                    e.target.value;
                                                                updateField(
                                                                    "experiences",
                                                                    updated
                                                                );
                                                            }}
                                                            className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                            placeholder="Company"
                                                        />
                                                    </div>
                                                    <div className="mb-2 flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Start Date
                                                            </label>
                                                            <input
                                                                type="month"
                                                                value={
                                                                    exp.startDate ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...(editedUser?.experiences ??
                                                                                []),
                                                                        ];
                                                                    updated[
                                                                        idx
                                                                    ].startDate =
                                                                        e.target.value;
                                                                    updateField(
                                                                        "experiences",
                                                                        updated
                                                                    );
                                                                }}
                                                                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                                placeholder="Start Date"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                End Date
                                                            </label>
                                                            <input
                                                                type="month"
                                                                value={
                                                                    exp.endDate ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...(editedUser?.experiences ??
                                                                                []),
                                                                        ];
                                                                    updated[
                                                                        idx
                                                                    ].endDate =
                                                                        e.target.value;
                                                                    updateField(
                                                                        "experiences",
                                                                        updated
                                                                    );
                                                                }}
                                                                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
                                                                placeholder="End Date"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 mt-4">
                                                        <button
                                                            onClick={() =>
                                                                setEditingExperienceIdx(
                                                                    null
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-[#0090D9] text-white rounded-md hover:bg-[#007bb5] text-sm"
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const updated =
                                                                    [
                                                                        ...(editedUser?.experiences ??
                                                                            []),
                                                                    ];
                                                                updated.splice(
                                                                    idx,
                                                                    1
                                                                );
                                                                updateField(
                                                                    "experiences",
                                                                    updated
                                                                );
                                                                setEditingExperienceIdx(
                                                                    null
                                                                );
                                                            }}
                                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="font-semibold text-gray-800 text-sm">
                                                            {exp.jobTitle}
                                                        </div>
                                                        <div className="text-gray-600 text-sm">
                                                            {exp.company}
                                                        </div>
                                                        <div className="text-gray-500 text-sm">
                                                            {exp.startDate
                                                                ? `${exp.startDate}`
                                                                : ""}
                                                            {exp.startDate
                                                                ? ` - ${
                                                                      exp.endDate
                                                                          ? exp.endDate
                                                                          : "Present"
                                                                  }`
                                                                : ""}
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            onClick={() =>
                                                                removeExperience(
                                                                    idx
                                                                )
                                                            }
                                                            className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
                                                        >
                                                            Remove
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setEditingExperienceIdx(
                                                                    idx
                                                                )
                                                            }
                                                            className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentUser?.experiences &&
                                currentUser.experiences.length > 0 ? (
                                    currentUser.experiences.map((exp, idx) => (
                                        <div
                                            key={idx}
                                            className="border-b pb-4 mb-4"
                                        >
                                            <div className="font-semibold text-base text-gray-800">
                                                {exp.jobTitle}
                                            </div>
                                            <div className="text-base text-gray-600">
                                                {exp.company}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {exp.startDate
                                                    ? `${exp.startDate}`
                                                    : ""}
                                                {exp.startDate
                                                    ? ` - ${
                                                          exp.endDate
                                                              ? exp.endDate
                                                              : "Present"
                                                      }`
                                                    : ""}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                                        No professional experience specified
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Skills & Expertise */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Skills & Expertise
                        </h2>

                        {/* Skills */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) =>
                                                setNewSkill(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" && addSkill()
                                            }
                                            className="flex-1 px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                                            placeholder="Add a skill..."
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-4 py-2 text-sm bg-[#0090D9] text-white rounded-md hover:bg-[#007bb5] transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(editedUser?.skills || []).map(
                                            (skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
                                                >
                                                    {skill}
                                                    <button
                                                        onClick={() =>
                                                            removeSkill(skill)
                                                        }
                                                        className="ml-2 hover:text-red-200 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {currentUser?.skills &&
                                    currentUser.skills.length > 0 ? (
                                        currentUser.skills.map(
                                            (skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md w-full">
                                            No skills specified
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Certifications
                            </label>
                            {isEditing ? (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCertification}
                                            onChange={(e) =>
                                                setNewCertification(
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                addCertification()
                                            }
                                            className="flex-1 px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                                            placeholder="Add a certification..."
                                        />
                                        <button
                                            onClick={addCertification}
                                            className="px-4 py-2 text-sm bg-[#0090D9] text-white rounded-md hover:bg-[#007bb5] transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {(editedUser?.certifications || []).map(
                                            (cert, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-[#E6F7FF] rounded-lg border border-[#0090D9]"
                                                >
                                                    <span className=" text-sm text-[#0090D9]">
                                                        {cert}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            removeCertification(
                                                                cert
                                                            )
                                                        }
                                                        className="text-red-500 text-sm hover:text-red-700 transition-colors"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {currentUser?.certifications &&
                                    currentUser.certifications.length > 0 ? (
                                        currentUser.certifications.map(
                                            (cert, index) => (
                                                <div
                                                    key={index}
                                                    className="pt-1 pb-1 px-3 bg-[#E6F7FF] rounded-lg border border-[#0090D9]"
                                                >
                                                    <span className="text-sm text-[#0090D9]">
                                                        {cert}
                                                    </span>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                                            No certifications specified
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
