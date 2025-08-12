import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { PaginatedList } from '../model/paginated-list';
import { ProjectDetailsModel } from '../model/Project/project-details-model';
import { AddEditProjectModel } from '../model/Project/add-edit-project-model';
import { ProjectQueryParamater } from '../model/QueryParamaters/project-query-paramater';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private projectsUpdated$ = new Subject<void>();
  private baseURL: string = "http://localhost:5140/api/project";

  constructor(private http: HttpClient) { }


  // GET /api/Project - Get all projects
  getAllProjects(
    projectQueryParamater: ProjectQueryParamater
  ): Observable<ApiResponse<PaginatedList<ProjectDetailsModel>>> {

    let params = new HttpParams();
    Object.entries(projectQueryParamater).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<PaginatedList<ProjectDetailsModel>>>(this.baseURL, {
      params,
      withCredentials: true
    });
  }

  // GET /api/Project/{id} - Get project by ID
  getProjectById(id: number): Observable<ProjectDetailsModel> {
    return this.http.get<ProjectDetailsModel>(`${this.baseURL}/${id}`, {
      withCredentials: true
    });
  }

  // POST /api/Project - Create new project
  addProject(project: AddEditProjectModel): Observable<ProjectDetailsModel> {
    console.log(project)

    return this.http.post<ProjectDetailsModel>(this.baseURL, project, {
      withCredentials: true
    }).pipe(
      tap({
        next: () => this.projectsUpdated$.next()
      })
    );
  }

  // PUT /api/Project/{id} - Update existing project
  updateProject(id: number, project: AddEditProjectModel): Observable<ProjectDetailsModel> {
    return this.http.put<ProjectDetailsModel>(`${this.baseURL}/${id}`, project, {
      withCredentials: true
    }).pipe(
      tap({
        next: () => this.projectsUpdated$.next()
      })
    );
  }

  // DELETE /api/Project/{id} - Delete project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`, {
      withCredentials: true
    }).pipe(
      tap({
        next: () => this.projectsUpdated$.next()
      })
    );
  }

  // Observable for any component to listen to
  onProjectsUpdated(): Observable<void> {
    return this.projectsUpdated$.asObservable();
  }


}
