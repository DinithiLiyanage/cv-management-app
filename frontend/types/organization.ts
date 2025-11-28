// Organization related types and constants

export interface Organization {
    id?: string;
    name: string;
    description: string;
    location: string;
    industry: string;
    memberCount: number;
    logo?: string;
    isVerified: boolean;
    membershipStatus?: "member" | "pending" | "admin" | "none";
}

export const INDUSTRY_OPTIONS = [
    { value: "", label: "Select an industry" },
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Retail", label: "Retail" },
    { value: "Consulting", label: "Consulting" },
    { value: "Energy", label: "Energy" },
    { value: "Media", label: "Media" },
    { value: "Non-profit", label: "Non-profit" },
    { value: "Other", label: "Other" },
] as const;

export type MembershipStatus = "member" | "pending" | "admin" | "none";
