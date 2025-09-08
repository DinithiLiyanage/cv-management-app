"use client";

import { useState, useRef } from "react";
import { Person, PhotoCamera } from "@mui/icons-material";

interface Step1PersonalInfoData {
  profilePicture?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

interface Step1PersonalInfoProps {
  data: Step1PersonalInfoData;
  updateData: (fields: Partial<Step1PersonalInfoData>) => void;
}

export default function Step1PersonalInfo({
  data,
  updateData,
}: Step1PersonalInfoProps) {
  const [profilePreview, setProfilePreview] = useState(data.profilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    field: keyof Step1PersonalInfoData,
    value: string
  ) => {
    updateData({ [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
        updateData({ profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-3 border-[#0090D9] bg-gray-100 flex items-center justify-center overflow-hidden">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Person className="text-gray-400 text-6xl" />
            )}
          </div>
          <button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 w-10 h-10 bg-[#0090D9] text-white rounded-full flex items-center justify-center hover:bg-[#007bb5] transition-colors"
          >
            <PhotoCamera className="text-sm" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <p className="text-sm text-gray-500">
          Click the camera icon to upload your profile picture
        </p>
      </div>

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio / About Yourself
        </label>
        <textarea
          value={data.bio || ""}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Tell us about yourself, your interests, and what makes you unique..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-[#0090D9] transition-colors resize-none text-sm text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(data.bio || "").length}/500 characters
        </p>
      </div>

      {/* Location and Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, Country"
            className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-[#0090D9] transition-colors text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-[#0090D9] transition-colors text-sm text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
