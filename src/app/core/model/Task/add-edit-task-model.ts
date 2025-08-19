export interface AddEditTaskModel {
    id: number;                
    title: string;
    description?: string;
    priority: 'Low' | 'Medium' | 'High';
    statusId: number;
    startDate: Date | null;
    endDate: Date | null;
    totalHours: number;
    label?: string;
    projectId: number;
    reportedBy: number;
    assignedTo: number;
}
