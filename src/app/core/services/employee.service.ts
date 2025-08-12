import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../model/api-response';
import { PaginatedList } from '../model/paginated-list';
import { EmployeeDetailsModel } from '../model/Employee/employee-details-model';
import { AddEditEmployeeDetails } from '../model/Employee/add-edit-employee-details';
import { EmployeeDetailsSelectModel } from '../model/Employee/employee-details-select-model';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  private baseURL: string = "http://localhost:5140/api/employee";
  constructor(private http: HttpClient) { }

  // GET /api/Employee - Get all employees
  getAllEmployees(pageNumber: number, pageSize: number, sortBy: string, searchTerm: string): Observable<ApiResponse<PaginatedList<EmployeeDetailsModel>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('searchTerm', searchTerm);
    return this.http.get<ApiResponse<PaginatedList<EmployeeDetailsModel>>>(this.baseURL,{ params, withCredentials: true });
  }

  //Get /api/Employee/select-list - Get all employees for assigned to project
  getEmployeeSelectList() : Observable<ApiResponse<EmployeeDetailsSelectModel[]>>{
    return this.http.get<ApiResponse<EmployeeDetailsSelectModel[]>>(this.baseURL+'/select-list',{withCredentials: true});
  } 

  // GET /api/Employee/{id} - Get employee by ID
  getEmployeeById(id: number): Observable<ApiResponse<EmployeeDetailsModel>> {
    return this.http.get<ApiResponse<EmployeeDetailsModel>>(`${this.baseURL}/${id}`, { withCredentials: true });
  }

  // POST /api/Employee - Create new employee
  addEmployee(employee: AddEditEmployeeDetails): Observable<ApiResponse<EmployeeDetailsModel>> {
    return this.http.post<ApiResponse<EmployeeDetailsModel>>(this.baseURL, employee, { withCredentials: true, mode: 'cors' });
  }

  // PUT /api/Employee/{id} - Update existing employee
  updateEmployee(id: number, employee: AddEditEmployeeDetails): Observable<ApiResponse<EmployeeDetailsModel>> {
    return this.http.put<ApiResponse<EmployeeDetailsModel>>(`${this.baseURL}/${id}`, employee, { withCredentials: true });
  }

  // DELETE /api/Employee/{id} - Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`, { withCredentials: true });
  }
}
