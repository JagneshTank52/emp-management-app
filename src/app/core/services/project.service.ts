import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { PaginatedList } from '../model/paginated-list';
import { ProjectDetailsModel } from '../model/Project/project-details-model';
import { AddEditProjectModel } from '../model/Project/add-edit-project-model';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private baseURL: string = "http://localhost:5140/api/project";
  constructor(private http: HttpClient) { }

  // GET /api/Project - Get all projects
  getAllProjects(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    searchTerm: string,
  ): Observable<ApiResponse<PaginatedList<ProjectDetailsModel>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('searchTerm', searchTerm);

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
    return this.http.post<ProjectDetailsModel>(this.baseURL, project, {
      withCredentials: true,
      mode: 'cors'
    });
  }

  // PUT /api/Project/{id} - Update existing project
  updateProject(id: number, project: AddEditProjectModel): Observable<ProjectDetailsModel> {
    return this.http.put<ProjectDetailsModel>(`${this.baseURL}/${id}`, project, {
      withCredentials: true
    });
  }

  // DELETE /api/Project/{id} - Delete project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`, {
      withCredentials: true
    });
  }

}
