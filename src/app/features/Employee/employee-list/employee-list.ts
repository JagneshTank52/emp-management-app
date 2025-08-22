import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { EmployeeService } from '../../../core/services/employee.service';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';
import { FormsModule } from '@angular/forms';
import { EmployeeDetailsModel } from '../../../core/model/Employee/employee-details-model';


@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterModule, ReusableBtn, FormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'

})
export class EmployeeList implements OnInit {
  message: string = '';
  loadEmpSubscription?: Subscription;
  deleteEmpSubscription?: Subscription;
  employees: EmployeeDetailsModel[] = [];
  pageNumber = 1;
  pageSize = 5;
  totalEmployee = 0;
  hasNextPage = true;
  hasPreviousPage = true;
  sortBy = '';
  searchTerm = '';
  pageSizeOptions: number[] = [5, 10, 15, 20,50];
  startCount: number = 0;
  endCount: number = 0;

  constructor(private employeeService: EmployeeService, private cdr: ChangeDetectorRef, private router: Router,) {
    console.log("constructor in emp list");
  }

  ngOnInit(): void {
    debugger;
    this.loadEmployees();
  }

  loadEmployees() {
    debugger; 
    this.loadEmpSubscription = this.employeeService.getAllEmployees(this.pageNumber, this.pageSize, this.sortBy, this.searchTerm).subscribe({
      next: (response) => {
        console.log('response: ', response);
        this.employees = response.data!.items ?? [];
        this.pageNumber = response.data!.pageIndex;
        this.pageSize = response.data!.pageSize;
        this.totalEmployee = response.data!.totalCounts;
        this.hasNextPage = response.data!.hasNextPage;
        this.hasPreviousPage = response.data!.hasPreviousPage;
        this.startCount = (this.pageNumber - 1) * this.pageSize + 1;
        this.endCount = Math.min(this.pageNumber * this.pageSize, this.totalEmployee);

        this.cdr.detectChanges();

        if (this.employees.length === 0) {
          this.message = 'No employees to display.';
        } else {
          this.message = '';
        }
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.message = 'Failed to load employees. ' + (err.message || 'Please try again later.');
        this.employees = [];
        this.startCount = 0;
        this.endCount = 0;
      }
    });
  }

  nextPage() {
    if (this.hasNextPage) {
      debugger;
      this.pageNumber++;
      this.loadEmployees();
    }
  }

  previousPage() {
    if (this.hasPreviousPage) {
      debugger;
      this.pageNumber--;
      this.loadEmployees();
    }
  }

  onPageSizeChange() {
    debugger;
    this.pageNumber = 1;
    this.loadEmployees();
  }

  deleteEmployee(id: number): void {
    debugger;
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.message = 'Deleting employee...';
      this.deleteEmpSubscription = this.employeeService.deleteEmployee(id).subscribe({
        next: (response) => {
          this.message = 'Employee deleted successfully!';
          console.log('Employee deleted:', response);

          this.loadEmployees();

          if (this.employees.length === 0) {
            this.message = 'No employees to display.';
          }
        },
        error: (error) => {
          this.message = 'Failed to delete employee. ' + (error.error?.message || error.message || '');
          console.error('Error deleting employee:', error);
        },

      });
    }
  }

  ngOnDestroy(): void {
    if (this.loadEmpSubscription) {
      this.loadEmpSubscription.unsubscribe();
    }
  }

  navigateToAddEmployee(): void {
    this.router.navigate(['employee', 'create']);
  }
  navigateToEditEmployee(id: number): void {
    this.router.navigate(['employee', id, 'edit']);
  }
  viewDetails(id: number): void {
    this.router.navigate(['employee', id]);
  }
}
