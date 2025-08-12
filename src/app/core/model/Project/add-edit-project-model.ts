export interface AddEditProjectModel {
    Id: number;
    Name: string;
    Type: string;
    TechnologyId: number;
    ProjectStatus: string;
    StartDate: Date; 
    EstimatedDueDate: Date; 
    EstimatedHours: number;
    AssignedEmployeeIds: number[];
}
