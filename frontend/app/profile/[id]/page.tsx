"use client";

import React from "react";
import Header from "../../../components/Header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Person, Edit, Save, Cancel, PhotoCamera } from "@mui/icons-material";

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
  jobTitle?: string;
  company?: string;
  experience?: string;
  industry?: string;
  // Skills
  skills?: string[];
  certifications?: string[];
  salaryExpectation?: string;
  // Preferences
  jobType?: string[];
  remote?: boolean;
  notifications?: boolean;
}
export default function ProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = params.id;
        const response = await fetch(
          `http://localhost:3001/api/user/profile/${userId}`
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

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    if (!editedUser) return;
    const currentArray = (editedUser[field] as string[]) || [];
    const isSelected = currentArray.includes(item);

    if (isSelected) {
      updateField(
        field,
        currentArray.filter((i) => i !== item)
      );
    } else {
      updateField(field, [...currentArray, item]);
    }
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

  const removeCertification = (cert: string) => {
    if (editedUser) {
      updateField(
        "certifications",
        (editedUser.certifications || []).filter((c) => c !== cert)
      );
    }
  };

  // Component for profile picture or icon
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

  const experienceOptions = [
    "Entry Level (0-2 years)",
    "Mid Level (2-5 years)",
    "Senior Level (5-10 years)",
    "Expert Level (10+ years)",
  ];

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

  const jobTypeOptions = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "freelance", label: "Freelance" },
    { id: "internship", label: "Internship" },
    { id: "temporary", label: "Temporary" },
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
    <div className="h-full w-full px-10">
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
                      {currentUser?.name || "Name not provided"}
                    </h1>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg text-gray-600">
                      {currentUser?.jobTitle || "Job title not provided"}
                    </p>
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
                  onChange={(e) => updateField("bio", e.target.value)}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
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
                      onChange={(e) => updateField("location", e.target.value)}
                      className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                      placeholder="City, Country"
                    />
                  ) : (
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      {currentUser?.location || "Not specified"}
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
                      onChange={(e) => updateField("phone", e.target.value)}
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h2>

              {/* Company */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.company || ""}
                    onChange={(e) => updateField("company", e.target.value)}
                    className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent"
                    placeholder="Company name"
                  />
                ) : (
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                    {currentUser?.company || "Not specified"}
                  </p>
                )}
              </div>

              {/* Experience & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser?.experience || ""}
                      onChange={(e) =>
                        updateField("experience", e.target.value)
                      }
                      className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent bg-white"
                    >
                      <option value="">Select level</option>
                      {experienceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      {currentUser?.experience || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  {isEditing ? (
                    <select
                      value={editedUser?.industry || ""}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent bg-white"
                    >
                      <option value="">Select industry</option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      {currentUser?.industry || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>
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
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
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
                    {(editedUser?.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-200 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentUser?.skills && currentUser.skills.length > 0 ? (
                    currentUser.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md w-full">
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
                      onChange={(e) => setNewCertification(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && addCertification()
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
                    {(editedUser?.certifications || []).map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#E6F7FF] rounded-lg border border-[#0090D9]"
                      >
                        <span className=" text-sm text-[#0090D9]">{cert}</span>
                        <button
                          onClick={() => removeCertification(cert)}
                          className="text-red-500 text-sm hover:text-red-700 transition-colors"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentUser?.certifications &&
                  currentUser.certifications.length > 0 ? (
                    currentUser.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="pt-1 pb-1 px-3 bg-[#E6F7FF] rounded-lg border border-[#0090D9]"
                      >
                        <span className="text-sm text-[#0090D9]">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                      No certifications specified
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Salary Expectation */}
            {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Expectation
            </label>
            {isEditing ? (
              <select
                value={editedUser?.salaryExpectation || ""}
                onChange={(e) =>
                  updateField("salaryExpectation", e.target.value)
                }

                className="w-full px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0090D9] focus:border-transparent bg-white"
              >
                <option value="">Select range</option>
                <option value="Under $30,000">Under $30,000</option>
                <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                <option value="$50,000 - $70,000">$50,000 - $70,000</option>
                <option value="$70,000 - $100,000">$70,000 - $100,000</option>
                <option value="$100,000 - $150,000">$100,000 - $150,000</option>
                <option value="$150,000+">$150,000+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {currentUser?.salaryExpectation || "Not specified"}
              </p>
            )}
          </div> */}
          </div>

          {/* Job Preferences */}
          {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Preferences
          </h2> */}

          {/* Job Types */}
          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Job Types
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {jobTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleArrayItem("jobType", option.id)}
                    className={`p-3 text-sm text-center rounded-lg border-2 transition-colors ${
                      (editedUser?.jobType || []).includes(option.id)
                        ? "border-[#0090D9] bg-blue-50 text-[#0090D9]"
                        : "border-gray-200 hover:border-[#0090D9] text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentUser?.jobType && currentUser.jobType.length > 0 ? (
                  currentUser.jobType.map((type) => {
                    const typeLabel =
                      jobTypeOptions.find((opt) => opt.id === type)?.label ||
                      type;
                    return (
                      <span
                        key={type}
                        className="px-3 py-1 bg-[#0090D9] text-white rounded-full text-sm"
                      >
                        {typeLabel}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md w-full">
                    No job type preferences specified
                  </p>
                )}
              </div>
            )}
          </div> */}

          {/* Remote Work & Notifications
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-sm text-gray-800">
                  Job Alerts
                </h4>
                <p className="text-sm text-gray-600">
                  Receive email notifications
                </p>
              </div>
              {isEditing ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editedUser?.notifications || false}
                    onChange={(e) =>
                      updateField("notifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
                </label>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentUser?.notifications
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentUser?.notifications ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>
          </div>*/}
          {/* </div>  */}
        </main>
      </div>
    </div>
  );
}
