import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeDetailsModel } from '../../../core/module/employee-details';


@Component({
  selector: 'app-employee-list',
  imports: [CommonModule,RouterModule ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  allEmployees: EmployeeDetailsModel[] = [];
  message: string = '';
  loadEmpSubscription?: Subscription;
  deleteEmpSubscription?: Subscription;

  constructor(private employeeService: EmployeeService) {
    console.log("constructor in emp list");
  }

  ngOnInit(): void {
    debugger;
    this.loadEmployees();
  }

  loadEmployees() {
    this.loadEmpSubscription = this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.allEmployees = data
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
    // Optional: Add a confirmation dialog
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.message = 'Deleting employee...'; // Show processing message
      this.deleteEmpSubscription = this.employeeService.deleteEmployee(id).subscribe({
        next: (response) => {
          this.message = 'Employee deleted successfully!';
          console.log('Employee deleted:', response);
          // Option 1: Filter out the deleted employee from the current list (optimistic update)
          this.allEmployees = this.allEmployees.filter(emp => emp.Id !== id);

          // Option 2 (Alternative/Fallback): Reload the entire list from the server
          // this.loadEmployees();

          // If the list becomes empty after deletion, update the message
          if (this.allEmployees.length === 0) {
            this.message = 'No employees to display.';
          }
        },
        error: (error) => {
          this.message = 'Failed to delete employee. ' + (error.error?.message || error.message || '');
          console.error('Error deleting employee:', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.loadEmpSubscription) {
      this.loadEmpSubscription.unsubscribe();
    }
  }
}
