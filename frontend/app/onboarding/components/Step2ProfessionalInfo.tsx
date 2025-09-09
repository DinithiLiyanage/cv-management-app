type Step2ProfessionalInfoProps = {
  data: {
    jobTitle: string;
    company: string;
    experience: string;
    industry: string;
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
    </div>
  );
}
