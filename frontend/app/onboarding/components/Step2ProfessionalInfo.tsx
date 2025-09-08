type Step2ProfessionalInfoProps = {
  data: {
    jobTitle: string;
    company: string;
    experience: string;
    industry: string;
    careerGoals?: string[];
  };
  updateData: (newData: any) => void;
};

export default function Step2ProfessionalInfo({
  data,
  updateData,
}: Step2ProfessionalInfoProps) {
  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const toggleCareerGoal = (goal: string) => {
    const currentGoals = data.careerGoals || [];
    const isSelected = currentGoals.includes(goal);

    if (isSelected) {
      updateData({
        careerGoals: currentGoals.filter((g) => g !== goal),
      });
    } else {
      updateData({
        careerGoals: [...currentGoals, goal],
      });
    }
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Professional Information
        </h2>
        <p className="text-gray-600">
          Tell us about your professional background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Job Title
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            placeholder="e.g. Software Developer"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 text-sm text-gray-500"
          />
        </div>

        {/* Current Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Company
          </label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="e.g. Tech Solutions Inc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 text-sm text-gray-500"
          />
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={data.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 bg-white text-sm text-gray-500"
          >
            <option value="">Select experience level</option>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            value={data.industry}
            onChange={(e) => handleInputChange("industry", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 bg-white text-sm text-gray-500"
          >
            <option value="">Select industry</option>
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Professional Goals */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Career Goals</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select all goals that align with your career aspirations
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
              (data.careerGoals || []).includes("career-growth")
                ? "border-[#0090D9] bg-blue-50"
                : "border-gray-200 hover:border-[#0090D9]"
            }`}
            onClick={() => toggleCareerGoal("career-growth")}
          >
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">Career Growth</h4>
              <p className="text-sm text-gray-600 mt-1">
                Advance in current field
              </p>
              {(data.careerGoals || []).includes("career-growth") && (
                <div className="mt-2">
                  <div className="inline-flex items-center justify-center w-5 h-5 bg-[#0090D9] rounded-full">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
              (data.careerGoals || []).includes("new-opportunities")
                ? "border-[#0090D9] bg-blue-50"
                : "border-gray-200 hover:border-[#0090D9]"
            }`}
            onClick={() => toggleCareerGoal("new-opportunities")}
          >
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">New Opportunities</h4>
              <p className="text-sm text-gray-600 mt-1">
                Explore different roles
              </p>
              {(data.careerGoals || []).includes("new-opportunities") && (
                <div className="mt-2">
                  <div className="inline-flex items-center justify-center w-5 h-5 bg-[#0090D9] rounded-full">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={`p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
              (data.careerGoals || []).includes("skill-development")
                ? "border-[#0090D9] bg-blue-50"
                : "border-gray-200 hover:border-[#0090D9]"
            }`}
            onClick={() => toggleCareerGoal("skill-development")}
          >
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800">Skill Development</h4>
              <p className="text-sm text-gray-600 mt-1">
                Learn new technologies
              </p>
              {(data.careerGoals || []).includes("skill-development") && (
                <div className="mt-2">
                  <div className="inline-flex items-center justify-center w-5 h-5 bg-[#0090D9] rounded-full">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
