import { useState } from "react";

type Step4PreferencesProps = {
  data: {
    jobType: string[];
    remote: boolean;
    notifications: boolean;
  };
  updateData: (newData: any) => void;
};

export default function Step4Preferences({
  data,
  updateData,
}: Step4PreferencesProps) {
  const jobTypeOptions = [
    { id: "full-time", label: "Full-time", icon: "🕘" },
    { id: "part-time", label: "Part-time", icon: "⏰" },
    { id: "contract", label: "Contract", icon: "📝" },
    { id: "freelance", label: "Freelance", icon: "💼" },
    { id: "internship", label: "Internship", icon: "🎓" },
    { id: "temporary", label: "Temporary", icon: "⚡" },
  ];

  const toggleJobType = (type: string) => {
    const isSelected = data.jobType.includes(type);
    if (isSelected) {
      updateData({
        jobType: data.jobType.filter((t) => t !== type),
      });
    } else {
      updateData({
        jobType: [...data.jobType, type],
      });
    }
  };

  const toggleRemote = () => {
    updateData({ remote: !data.remote });
  };

  const toggleNotifications = () => {
    updateData({ notifications: !data.notifications });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Job Preferences
        </h2>
        <p className="text-gray-600 text-md">
          Set your preferences to get personalized job recommendations
        </p>
      </div>

      {/* Job Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Preferred Job Types
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select all that apply to you
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {jobTypeOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => toggleJobType(option.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                data.jobType.includes(option.id)
                  ? "border-[#0090D9] bg-blue-50"
                  : "border-gray-200 hover:border-[#0090D9]"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{option.icon}</div>
                <h4 className="text-sm font-medium text-gray-800">{option.label}</h4>
                {data.jobType.includes(option.id) && (
                  <div className="mt-2">
                    <span className="inline-block w-5 h-5 bg-[#0090D9] rounded-full text-white text-xs flex items-center justify-center">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Location Preferences */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Work Location
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Remote Work</h4>
              <p className="text-sm text-gray-600">
                I'm interested in remote opportunities
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.remote}
                onChange={toggleRemote}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors duration-200 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-[#0090D9]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-800">On-site</h4>
                <p className="text-xs text-gray-600 mt-1">Office based</p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors duration-200 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-800">Hybrid</h4>
                <p className="text-xs text-gray-600 mt-1">Mix of both</p>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#0090D9] transition-colors duration-200 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-medium text-gray-800">Any Location</h4>
                <p className="text-xs text-gray-600 mt-1">Open to all</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Job Alerts</h4>
              <p className="text-sm text-gray-600">
                Get notified when new jobs match your preferences
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.notifications}
                onChange={toggleNotifications}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0090D9]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-[#0090D9] to-[#007bb5] rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">🎉 You're All Set!</h3>
        <p className="text-sm opacity-90 mb-4">
          Your profile is ready to help you find the perfect job opportunities.
          You can always update your preferences later in your profile settings.
        </p>
      </div>
    </div>
  );
}
