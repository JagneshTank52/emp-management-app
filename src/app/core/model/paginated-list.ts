export interface PaginatedList<T> {
    Items: T[];
    PageIndex: number;
    PageSize: number;
    TotalPages: number;
    TotalCounts: number;
    HasPreviousPage: boolean;
    HasNextPage: boolean;
}
