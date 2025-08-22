import { WorkSheetWorklogModel } from "./work-sheet-worklog-model";

export interface WorkSheetTaskDetailsModel {
    id: number;
    code: string;
    title: string;
    totalTimeSpent: number;
    startDate: Date;   // or string if backend sends as ISO string
    endDate: Date;     // same consideration
    taskStatus: number;
    statusName: string;
    statusColor: string;
    workLogDetails: WorkSheetWorklogModel[];
}
