// Job related types and constants

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
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
    "IT Jobs",
    "Engineering Jobs",
    "Marketing Jobs",
    "Sales Jobs",
    "Customer Service Jobs",
    "Healthcare & Nursing Jobs",
    "Education Jobs",
    "Finance Jobs",
    "HR & Recruitment Jobs",
    "Legal Jobs",
    "Other",
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];
