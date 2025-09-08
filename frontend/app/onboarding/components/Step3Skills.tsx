import { useState } from "react";

type Step3SkillsProps = {
  data: {
    skills: string[];
    certifications: string[];
    salaryExpectation: string;
  };
  updateData: (newData: any) => void;
};

export default function Step3Skills({ data, updateData }: Step3SkillsProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const popularSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "TypeScript",
    "MongoDB",
    "SQL",
    "AWS",
    "Git",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Vue.js",
    "Angular",
    "PHP",
    "C++",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "UI/UX Design",
    "Digital Marketing",
  ];

  const salaryRanges = [
    "Under $30,000",
    "$30,000 - $50,000",
    "$50,000 - $70,000",
    "$70,000 - $100,000",
    "$100,000 - $150,000",
    "$150,000+",
    "Prefer not to say",
  ];

  const addSkill = (skill: string) => {
    if (skill && !data.skills.includes(skill)) {
      updateData({ skills: [...data.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    updateData({
      skills: data.skills.filter((s) => s !== skill),
    });
  };

  const addCustomSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !data.certifications.includes(newCertification.trim())
    ) {
      updateData({
        certifications: [...data.certifications, newCertification.trim()],
      });
      setNewCertification("");
    }
  };

  const removeCertification = (cert: string) => {
    updateData({
      certifications: data.certifications.filter((c) => c !== cert),
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Skills & Expertise
        </h2>
        <p className="text-gray-600">
          Add your skills to help employers find you
        </p>
      </div>

      {/* Popular Skills */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Popular Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              disabled={data.skills.includes(skill)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                data.skills.includes(skill)
                  ? "bg-[#0090D9] text-white cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-[#0090D9] hover:text-white cursor-pointer"
              }`}
            >
              {skill}
              {data.skills.includes(skill) && <span className="ml-2">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Skill Input */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Add Custom Skill
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter a skill..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none text-sm text-gray-500"
            onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
          />
          <button
            onClick={addCustomSkill}
            className="px-6 py-2 bg-[#0090D9] text-sm text-white rounded-lg hover:bg-[#007bb5] transition-colors duration-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Skills */}
      {data.skills.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-4">
            Your Skills ({data.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-4 py-2 bg-[#0090D9] text-white rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-red-200 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Certifications (Optional)
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            placeholder="e.g., AWS Certified Developer"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none text-sm text-gray-500"
            onKeyPress={(e) => e.key === "Enter" && addCertification()}
          />
          <button
            onClick={addCertification}
            className="px-6 py-2 bg-[#0090D9] text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Add
          </button>
        </div>

        {data.certifications.length > 0 && (
          <div className="space-y-2">
            {data.certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#E6F7FF] rounded-lg border border-green-200"
              >
                <span className="text-sm text-[#0090D9]">{cert}</span>
                <button
                  onClick={() => removeCertification(cert)}
                  className="text-red-500 text-sm hover:text-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Salary Expectation */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-4">
          Salary Expectation (Optional)
        </h3>
        <select
          value={data.salaryExpectation}
          onChange={(e) => updateData({ salaryExpectation: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0090D9] focus:border-transparent outline-none transition-all duration-200 bg-white text-sm text-gray-500"
        >
          <option value="">Select salary range</option>
          {salaryRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
