export interface TaskDetailsModel {
    Id: number;
    Title: string;
    Code: string | null;
    Description: string | null; 
    Priority: string; //
    StatusId: number; //
    StatusName: string; //
    StartDate: string;   // // Use string for DateTime when receiving from API (ISO format)
    EndDate: string; //
    TotalHours: number; //
    Label: string | null; //
    ProjectId: number; //
    ProjectName: string; //
    ReportedBy: number; //
    ReportedByName: string; //
    AssignedTo: number; //
    AssignedToName: string; //
    CreatedAt: string; //
    // here alos send updated at for last modified date
}

