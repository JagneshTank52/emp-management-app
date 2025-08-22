import { DailyWorklogDetailsModel } from "./daily-worklog-details-model";
import { WorkSheetTaskDetailsModel } from "./work-sheet-task-details-model";

export interface WorkSheetDetailsModel {
    projectId: number;
    projectName: string;
    projectCode: string;
    ProjectTotalMinutes: number;
    tasks: WorkSheetTaskDetailsModel[];
    dailyWorkLogs: DailyWorklogDetailsModel[];
}
