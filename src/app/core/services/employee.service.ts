import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EmployeeDetailsModel } from '../model/employee-details';
import { AddEditEmployeeDetails } from '../model/add-edit-employee-details';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {

  private baseURL: string = "http://localhost:5140/api/employee";
  constructor(private http: HttpClient) { }

  // GET /api/Employee - Get all employees
  getAllEmployees(): Observable<EmployeeDetailsModel[]> {
    return this.http.get<EmployeeDetailsModel[]>(this.baseURL,{withCredentials: true});
  }

  // GET /api/Employee/{id} - Get employee by ID
  getEmployeeById(id: number): Observable<EmployeeDetailsModel> {
    return this.http.get<EmployeeDetailsModel>(`${this.baseURL}/${id}`,{withCredentials: true});
  }

  // POST /api/Employee - Create new employee
  addEmployee(employee: AddEditEmployeeDetails): Observable<EmployeeDetailsModel> {
    return this.http.post<EmployeeDetailsModel>(this.baseURL, employee,{withCredentials: true,mode: 'cors' });
  }

  // PUT /api/Employee/{id} - Update existing employee
  updateEmployee(id: number, employee: AddEditEmployeeDetails): Observable<EmployeeDetailsModel> {
    return this.http.put<EmployeeDetailsModel>(`${this.baseURL}/${id}`, employee,{withCredentials: true});
  }

  // DELETE /api/Employee/{id} - Delete employee
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`,{withCredentials: true});
  }
}
