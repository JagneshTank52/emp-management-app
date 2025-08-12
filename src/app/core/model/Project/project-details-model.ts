import { AssignedEmployeeModel } from "./assigned-employee-model";

export interface ProjectDetailsModel {
    Id: number;
    Name: string;
    Code?: string;
    Type?: string;
    TechnologyId?: number;
    TechnologyName: string;
    ProjectStatus?: string;
    StartDate: string; 
    EstimatedDueDate?: string;
    EstimatedHours?: number;
    CreatedAt: string; 
    UpdatedAt: string; 
    AssignedEmployee: AssignedEmployeeModel[];
}
