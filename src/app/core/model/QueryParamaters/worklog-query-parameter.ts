import { PaginationQueryParamater } from "./pagination-query-paramater";

export interface WorklogQueryParameter extends PaginationQueryParamater {
    taskId: number | null;
    assignedToId: number | null;
}
