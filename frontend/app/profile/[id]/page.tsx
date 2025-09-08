"use client";

import React from "react";
import Header from "../../../components/Header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Person } from "@mui/icons-material";

const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  role: "Software Engineer",
  avatarUrl: "https://ui-avatars.com/api/?name=Jane+Doe",
};

export default function ProfilePage() {
  const params = useParams();
  interface UserProfile {
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
  }
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = params.id; // Extract ID from URL params
        const response = await fetch(
          `http://localhost:3001/api/user/profile/${userId}`
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (params.id) {
      fetchUserProfile();
    }
  }, [params.id]);

  // Component for profile picture or icon
  const ProfileImage = ({ size = "w-8 h-8", showBorder = false }) => {
    if (user?.profilePicture) {
      return (
        <img
          src={user.profilePicture}
          alt="Profile"
          className={`${size} rounded-full object-cover ${
            showBorder ? "border-1 border-[#0090D9]" : ""
          }`}
        />
      );
    }
    return (
      <Person
        className={`text-[#0090D9] ${
          size === "w-24 h-24" ? "text-2xl" : "text-lg"
        }`}
      />
    );
  };

  return (
    <div className="min-h-screen">
      <div className="w-full h-full">
        {/* Header */}
        <Header />

        {/* Profile Content */}
        <main className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex items-center space-x-6 mb-6">
            <ProfileImage size="w-24 h-24" showBorder={true} />
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.role}</p>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <div className="bg-gray-100 rounded px-4 py-2">{user?.email}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
