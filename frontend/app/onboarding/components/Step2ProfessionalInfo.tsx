type Step2ProfessionalInfoProps = {
    data: {
        jobTitle: string;
        company: string;
        startDate: string;
        endDate?: string;
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
                        onChange={(e) =>
                            handleInputChange("jobTitle", e.target.value)
                        }
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
                        onChange={(e) =>
                            handleInputChange("company", e.target.value)
                        }
                        placeholder="e.g. Tech Solutions Inc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 text-sm text-gray-500"
                    />
                </div>

                {/* Experience Level */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Start Date
                            </label>
                            <input
                                type="month"
                                value={data.startDate}
                                onChange={(e) =>
                                    handleInputChange(
                                        "startDate",
                                        e.target.value
                                    )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 text-sm text-gray-700 bg-white"
                                placeholder="Start Date"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                End Date
                            </label>
                            <input
                                type="month"
                                value={data.endDate}
                                onChange={(e) =>
                                    handleInputChange("endDate", e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 text-sm text-gray-700 bg-white"
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        If you are currently employed, leave the end date empty.
                    </div>
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                    </label>
                    <select
                        value={data.industry}
                        onChange={(e) =>
                            handleInputChange("industry", e.target.value)
                        }
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
