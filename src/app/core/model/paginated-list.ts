export interface PaginatedList<T> {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalCounts: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
