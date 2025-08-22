import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';
import { EmployeeDetailsModel } from '../../../core/model/Employee/employee-details-model';

@Component({
  selector: 'app-employee-details',
  imports: [RouterModule, CommonModule,ReusableBtn],
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    debugger;
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
      next: (response) => {

        this.employee = response.data;
        
        this.cdr.detectChanges();
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

  backToList() : void {
    this.router.navigate(['employee']);
  }
  navigateToEditEmployee() : void {
    this.router.navigate(['employee',this.employeeId,'edit']);
  }
}
