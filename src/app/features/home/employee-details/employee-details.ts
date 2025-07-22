import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeDetailsModel } from '../../../core/module/employee-details';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  imports: [RouterModule, CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  employee: EmployeeDetailsModel | undefined;
  employeeId: number | null = null;
  errorMessage: string = '';
  private routeSubscription?: Subscription;
  private employeeSubscription?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.employeeId = +idParam; // Convert string to number
        this.loadEmployeeDetails(this.employeeId);
      } else {
        this.errorMessage = 'Employee ID is missing from the URL.';
      }
    });
  }

  loadEmployeeDetails(id: number): void {
    this.employeeSubscription = this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.errorMessage = ''; // Clear any previous error
      },
      error: (err) => {
        console.error('Error fetching employee details:', err);
        this.errorMessage = 'Failed to load employee details. Please try again or check if the employee exists.';
        this.employee = undefined; // Clear employee data on error
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.employeeSubscription?.unsubscribe();
  }

}
