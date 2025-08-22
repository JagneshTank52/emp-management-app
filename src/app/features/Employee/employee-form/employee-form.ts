import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';
import { AddEditEmployeeDetails } from '../../../core/model/Employee/add-edit-employee-details';
import { EmployeeDetails } from '../employee-details/employee-details';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,ReusableBtn],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})

export class EmployeeForm implements OnInit {
  employeeForm!: FormGroup;
  message: string = '';
  isEditMode: boolean = false;
  employeeId: number | null = null;
  routeSubscription?: Subscription;
  employeeDataSubscription?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (idParam) {
        this.isEditMode = true;
        this.employeeId = +idParam;
        this.loadEmployeeForEdit(this.employeeId);
      } else {
        this.isEditMode = false;
        this.employeeId = null;
        this.employeeForm.reset();
        this.employeeForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.employeeForm.get('password')?.updateValueAndValidity({ emitEvent: false });
      }
      this.updatePasswordValidators(); // Call this to set initial password validation based on mode
    });
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
      address: ['', Validators.required],
      departmentId: [null, [Validators.required, Validators.min(1)]],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Password: Initially set validators for ADD mode.
      // These will be cleared/adjusted in updatePasswordValidators() or loadEmployeeForEdit()
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: [null, [Validators.required, Validators.min(1)]],
    });

    // Subscribe to password value changes to dynamically adjust validators
    this.employeeForm.get('password')?.valueChanges.subscribe(() => {
      this.updatePasswordValidators();
    });
  }

  private updatePasswordValidators(): void {
    debugger;
    const passwordControl = this.employeeForm.get('password');
    if (passwordControl) {
      if (this.isEditMode) {
        // In edit mode, password is required only if a value is entered.
        // Otherwise, it's optional (meaning it won't be sent or won't change).
        if (passwordControl.value) {
          passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
        } else {
          passwordControl.clearValidators();
        }
      } else {
        // In add mode, password is always required.
        passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
      }
      passwordControl.updateValueAndValidity({ emitEvent: false }); // Update validity without triggering infinite loop
    }
  }

  private loadEmployeeForEdit(id: number): void {
    debugger;
    this.employeeDataSubscription = this.employeeService.getEmployeeById(id).subscribe({
      next: (response) => {
        const employee = response.data;
        this.employeeForm.patchValue({
          firstName: employee!.firstName,
          lastName: employee!.lastName,
          phoneNumber: employee!.phoneNumber,
          gender: employee!.gender,
          dateOfBirth: employee!.dateOfBirth,
          address: employee!.address,
          departmentId: employee!.departmentId,
          userName: employee!.userName,
          email: employee!.email,
          password: employee!.password,
          // Do NOT patch password here for security reasons.
          // If the backend sends it back, it might be hashed or null.
          // The user should explicitly type it to change it.
          roleId: employee!.roleId
        });
        // Clear password validators immediately after loading for edit,
        // as it's now optional unless the user types something.
        // this.employeeForm.get('password')?.clearValidators();
        // this.employeeForm.get('password')?.updateValueAndValidity();
      },
      error: (err) => {
        console.error('Error loading employee for edit:', err);
        this.message = 'Failed to load employee data for editing.';
        this.router.navigate(['/employees']);
      }
    });
  }


  onSubmit(): void {
    debugger;
    if (this.employeeForm.valid) {
      const employeeData = { ...this.employeeForm.value }; // Create a copy to avoid modifying form directly
      this.message = 'Processing...';

      if (this.isEditMode && this.employeeId) {
        employeeData.Id = this.employeeId; // Assign the ID

        // If password field is empty in edit mode, remove it from the payload
        // This is a common pattern when password change is optional
        if (employeeData.password === '') {
          delete employeeData.Password;
        }

        this.employeeService.updateEmployee(this.employeeId,employeeData as AddEditEmployeeDetails).subscribe({ // Cast for type safety
          next: (response) => {
            this.message = 'Employee updated successfully!';
            console.log('Employee updated:', response);
            this.router.navigate(['/employee',response.data?.id]);
          },
          error: (error) => {
            this.message = 'Failed to update employee. ' + (error.error?.message || error.message || '');
            console.error('Error updating employee:', error);
          }
        });
      } else {
        this.employeeService.addEmployee(employeeData as AddEditEmployeeDetails).subscribe({ // Cast for type safety
          next: (response) => {
            this.message = 'Employee added successfully!';
            this.employeeForm.reset();
            console.log('Employee added:', response);
            this.router.navigate(['/employee',response.data?.id]);
          },
          error: (error) => {
            this.message = 'Failed to add employee. ' + (error.error?.message || error.message || '');
            console.error('Error adding employee:', error);
          }
        });
      }
    } else {
      this.message = 'Please fill in all required fields correctly.';
      this.employeeForm.markAllAsTouched();
    }
  }

  backToList(): void{
    this.router.navigate(['employee']);
  }
}
