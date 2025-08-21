export interface WorklogDetailsModel {
    Id: number;
    WorkLogTitle: string;
    Code: string;
    TaskId: number;
    TaskCode: string;
    TaskTitle: string;
    AssignedToName: string;
    WorkDate: string | null;
    TaskStatusName: string;
    TaskStatusColor?: string;
    WorkTimeHours: number;
    IsEditable: boolean;
    CreatedAt: string | null;
    UpdatedAt?: string | null;
}
