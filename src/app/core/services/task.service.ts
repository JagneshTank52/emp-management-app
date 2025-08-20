import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskQueryParamater } from '../model/QueryParamaters/task-query-paramater';
import { ApiResponse } from '../model/api-response';
import { BehaviorSubject, map, Observable, shareReplay, startWith, tap } from 'rxjs';
import { PaginatedList } from '../model/paginated-list';
import { TaskDetailsModel } from '../model/Task/task-details-model';
import { StatusColumn } from '../model/status-column';
import { AddEditProjectModel } from '../model/Project/add-edit-project-model';
import { AddEditTaskModel } from '../model/Task/add-edit-task-model';

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private baseURL: string = "http://localhost:5140/api/task"

  private tasksSubject = new BehaviorSubject<TaskDetailsModel[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();
  private viewModeSubject = new BehaviorSubject<'dashboard' | 'list'>('dashboard');
  readonly viewMode$ = this.viewModeSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ========= API CALL =========

  // GET /api/Task - Get all tasks
  getAllTasks(
    taskQueryParamater?: TaskQueryParamater
  ): Observable<ApiResponse<PaginatedList<TaskDetailsModel>>> {

    let params = new HttpParams();
    if (taskQueryParamater) {
      Object.entries(taskQueryParamater).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedList<TaskDetailsModel>>>(this.baseURL, {
      params,
      withCredentials: true
    }).pipe(
      tap(res => this.tasksSubject.next(res.Data!.Items || [])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  // GET /api/task/{id} - Get task by ID
  getTaskById(id: number): Observable<TaskDetailsModel> {
    return this.http.get<TaskDetailsModel>(`${this.baseURL}/${id}`, {
      withCredentials: true
    });
  }

  // POST /api/task - Create new task
  addTask(task: AddEditTaskModel): Observable<TaskDetailsModel> {
    return this.http.post<TaskDetailsModel>(this.baseURL, task, { withCredentials: true }).pipe(
      tap(newTask => this.tasksSubject.next([...this.tasksSubject.getValue(), newTask]))
    );
  }

  // PUT /api/task/{id} - Update existing task
  updateTask(id: number, task: AddEditTaskModel): Observable<TaskDetailsModel> {
    return this.http.put<TaskDetailsModel>(`${this.baseURL}/${id}`, task, { withCredentials: true }).pipe(
      tap(updatedTask => {
        const currentTasks = this.tasksSubject.getValue();
        const index = currentTasks.findIndex(t => t.Id === id);
        if (index > -1) currentTasks[index] = updatedTask;
        this.tasksSubject.next([...currentTasks]);
      })
    );
  }

  // DELETE /api/task/{id} - Delete task
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`, {
      withCredentials: true
    }).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.filter(t => t.Id !== id);
        this.tasksSubject.next([...updatedTasks]); 
      })
    );
  }

  // ========= STATE MANAGEMENT =========

  getTasksGrouped(statuses: StatusColumn[]): Observable<StatusColumn[]> {
    return this.tasks$.pipe(
      map(tasks => {
        const grouped = statuses.map(s => ({ ...s, tasks: [] as TaskDetailsModel[] }));
        tasks.forEach(task => {
          const column = grouped.find(c => c.id === task.StatusId);
          if (column) column.tasks.push(task);
        });
        return grouped;
      })
    );
  }

  setViewMode(mode: 'dashboard' | 'list') {
    this.viewModeSubject.next(mode);
  }
}
