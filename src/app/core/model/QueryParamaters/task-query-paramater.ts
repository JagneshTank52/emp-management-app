import { PaginationQueryParamater } from "./pagination-query-paramater";

export interface TaskQueryParamater extends PaginationQueryParamater {
    statusId: number | null;
    priority: string | null;
    projectId: number | null;
    assignedTo: number | null;
}
