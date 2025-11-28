// Re-export all types from a central location
export * from "./user";
export * from "./organization";
export * from "./job";

// Common/shared types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    total?: number;
}

export interface SearchParams {
    query: string;
    filters?: Record<string, any>;
}
