import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeDetailsModel } from '../../../core/model/employee-details';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';


@Component({
  selector: 'app-employee-list',
  imports: [CommonModule,RouterModule,ReusableBtn],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'

})
export class EmployeeList implements OnInit {
  allEmployees: EmployeeDetailsModel[] = [];
  // allEmployees$: Observable<EmployeeDetailsModel[]>;
  message: string = '';
  loadEmpSubscription?: Subscription;
  deleteEmpSubscription?: Subscription;

  constructor(private employeeService: EmployeeService,private cdr: ChangeDetectorRef,private router: Router,) {
    console.log("constructor in emp list");
  }

  ngOnInit(): void {
    debugger;
    this.loadEmployees();
  }

  loadEmployees() {
    this.loadEmpSubscription = this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data;
        this.cdr.detectChanges();
         console.log('All Employees:', this.allEmployees);
        if (this.allEmployees.length === 0) {
          this.message = 'No employees to display.';
        } else {
          this.message = '';
        }
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.message = 'Failed to load employees. ' + (err.message || 'Please try again later.');
      }
    });
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

          if (this.allEmployees.length === 0) {
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

  navigateToAddEmployee() : void {
    this.router.navigate(['employee','create']);
  }
  navigateToEditEmployee(id: number) : void {
    this.router.navigate(['employee',id,'edit']);
  }
  viewDetails(id: number) : void {
    this.router.navigate(['employee',id]);
  }
}
