// User profile related types and constants

export interface ProfessionalExperience {
    jobTitle?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    industry?: string;
}

export interface UserProfile {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    secondaryEmails?: string[];
    phone?: string;
    location?: string;
    bio?: string;
    profilePicture?: string;
    jobTitle?: string;
    company?: string;
    industry?: string;
    skills?: string[];
    certifications?: string[];
    experiences?: ProfessionalExperience[];
    salaryExpectation?: string;
    jobType?: string[];
    remote?: boolean;
    notifications?: boolean;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    marketingEmails?: boolean;
    profileVisibility?: "public" | "private" | "connections";
    showEmail?: boolean;
    showPhone?: boolean;
    showLocation?: boolean;
}

export const JOB_TYPE_OPTIONS = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "freelance", label: "Freelance" },
    { id: "internship", label: "Internship" },
    { id: "temporary", label: "Temporary" },
] as const;

export const SALARY_EXPECTATION_OPTIONS = [
    { value: "", label: "Select range" },
    { value: "Under $30,000", label: "Under $30,000" },
    { value: "$30,000 - $50,000", label: "$30,000 - $50,000" },
    { value: "$50,000 - $70,000", label: "$50,000 - $70,000" },
    { value: "$70,000 - $100,000", label: "$70,000 - $100,000" },
    { value: "$100,000 - $150,000", label: "$100,000 - $150,000" },
    { value: "$150,000+", label: "$150,000+" },
    { value: "Prefer not to say", label: "Prefer not to say" },
] as const;

export type JobType = "full-time" | "part-time" | "contract" | "freelance" | "internship" | "temporary";
export type ProfileVisibility = "public" | "private" | "connections";
