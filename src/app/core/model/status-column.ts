import { Task } from "./task";

export interface StatusColumn {
    id: number,
    title: string;
    color: string;
    tasks: Task[];
}
