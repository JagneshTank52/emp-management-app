import { AssignedEmployeeModel } from "./assigned-employee-model";

export interface ProjectDetailsModel {
    id: number;
    name: string;
    code?: string;
    type?: string;
    technologyId?: number;
    technologyName: string;
    projectStatus?: string;
    startDate: string; 
    estimatedDueDate?: string;
    estimatedHours?: number;
    createdAt: string; 
    updatedAt: string; 
    assignedEmployee: AssignedEmployeeModel[];
}
