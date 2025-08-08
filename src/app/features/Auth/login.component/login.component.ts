import { Component, OnInit } from '@angular/core';
import {
  AuthService
} from '../../../core/services/auth.service';
import { Subscribable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReusableBtn } from '../../../shared/reusable-btn/reusable-btn';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../core/model/Auth/login-request';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, CommonModule, ReusableBtn],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials!: LoginRequest;
  loginForm!: FormGroup;
  loginSubscription?: Subscription;
  loginImage: string = "assets/images/HR-Software-India.png";

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  login(): void {
    this.loginSubscription = this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Successfully logged in');
        this.router.navigate(['/employee'])
      },
      error: (err) => {
        console.error('Error to login :', err);
      }
    });
  }

  onSubmit(): void {
    debugger;
    if (this.loginForm.valid) {
      this.credentials = { ...this.loginForm.value };
      console.log(`Login credentials: ${JSON.stringify(this.credentials)}`);
      if (this.loginSubscription) {
        this.loginSubscription.unsubscribe();
      }
      this.login();
    }
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
