export interface AddEditProjectModel {
    id: number;
    name: string;
    type: string;
    technologyId: number;
    projectStatus: string;
    startDate: string; 
    estimatedDueDate: string; 
    estimatedHours: number;
    assignedEmployeeIds: number[];
}
