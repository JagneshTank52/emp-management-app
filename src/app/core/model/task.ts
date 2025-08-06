export interface Task {
    id: string;
    title: string;
    priority: 'Low' | 'Medium' | 'High';
    assignee: string;
}
