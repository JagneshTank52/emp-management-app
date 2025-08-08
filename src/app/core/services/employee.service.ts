import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '../model/api-response';
import { PaginatedList } from '../model/paginated-list';
import { EmployeeDetailsModel } from '../model/Employee/employee-details-model';
import { AddEditEmployeeDetails } from '../model/Employee/add-edit-employee-details';

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

  // GET /api/Employee/{id} - Get employee by ID
  getEmployeeById(id: number): Observable<EmployeeDetailsModel> {
    return this.http.get<EmployeeDetailsModel>(`${this.baseURL}/${id}`, { withCredentials: true });
  }

  // POST /api/Employee - Create new employee
  addEmployee(employee: AddEditEmployeeDetails): Observable<EmployeeDetailsModel> {
    return this.http.post<EmployeeDetailsModel>(this.baseURL, employee, { withCredentials: true, mode: 'cors' });
  }

  // PUT /api/Employee/{id} - Update existing employee
  updateEmployee(id: number, employee: AddEditEmployeeDetails): Observable<EmployeeDetailsModel> {
    return this.http.put<EmployeeDetailsModel>(`${this.baseURL}/${id}`, employee, { withCredentials: true });
  }

  // DELETE /api/Employee/{id} - Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`, { withCredentials: true });
  }
}
