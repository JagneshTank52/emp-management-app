import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RegisterRequest } from '../../../core/model/register-request';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';


@Component({
  selector: 'app-register.component',
  imports: [ReactiveFormsModule, CommonModule,ReusableBtn],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit, OnDestroy {
  credentials!: RegisterRequest;
  registerForm!: FormGroup;
  registerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    debugger;
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
      ]],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [
        Validators.required,
        Validators.pattern(/^(Male|Female|Other)$/)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmPassword?.errors) {
        delete confirmPassword.errors['mismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  register(): void {
    this.registerSubscription = this.authService.register(this.credentials).subscribe({
      next: (message: string) => {
        console.log('Registration successful:', message);
        this.router.navigate(['auth','login']);
      },
      error: (error: any) => {
        console.error('Registration error:', error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.credentials = this.registerForm.value;
      console.log(`Register credentials: ${JSON.stringify(this.credentials)}`);
      if (this.registerSubscription) {
        this.registerSubscription.unsubscribe();
      }
      this.register();
    }
  }

  ngOnDestroy(): void {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }
}
