export interface TaskDetailsModel {
    id: number;
    title: string;
    code: string | null;
    description: string | null; 
    priority: string; //
    statusId: number; //
    statusName: string; //
    startDate: string;   // // Use string for DateTime when receiving from API (ISO format)
    endDate: string; //
    totalHours: number; //
    label: string | null; //
    projectId: number; //
    projectName: string; //
    reportedBy: number; //
    reportedByName: string; //
    assignedTo: number; //
    assignedToName: string; //
    createdAt: string; //
    // here alos send updated at for last modified date
}

