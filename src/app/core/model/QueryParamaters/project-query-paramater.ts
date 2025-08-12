import { PaginationQueryParamater } from "./pagination-query-paramater";

export interface ProjectQueryParamater extends PaginationQueryParamater {
    technologyId: number | null,
    projectStatus: '',
    type: ''
}