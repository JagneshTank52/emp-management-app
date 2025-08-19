import { Task } from "./task";
import { TaskDetailsModel } from "./Task/task-details-model";

export interface StatusColumn {
    id: number,
    title: string;
    color: string;
    tasks: TaskDetailsModel[];
}
