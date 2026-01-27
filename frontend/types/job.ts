// Job related types and constants

export interface Job {
    id: string;
    title: string;
    company?: string;
    location?: string;
    category: string;
    salary_min?: number;
    salary_max?: number;
    description: string;
    url: string;
    tags?: string[];
}

export interface JobSearchParams {
    country?: string;
    page?: number;
    query?: string;
    location?: string;
    category?: string;
}

export const JOB_CATEGORIES = [
    "IT",
    "Engineering",
    "Marketing",
    "Sales",
    "Customer Service",
    "Healthcare & Nursing",
    "Education",
    "Finance",
    "HR & Recruitment",
    "Legal",
    "Other",
] as const;

export interface InternalJob extends Job {
    _id?: string;
    source: "internal";
    orgId: string;
    postedBy: string;
    requirements?: string[];
    responsibilities?: string[];
    benefits?: string[];
    deadline?: Date;
    status: "open" | "closed";
    jobType: string[];
    createdBy: string;
}

export type JobCategory = typeof JOB_CATEGORIES[number];
