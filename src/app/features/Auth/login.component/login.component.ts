import { Component, OnInit } from '@angular/core';
import {
  AuthService

} from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/model/login-request';
import { Subscribable, Subscription } from 'rxjs';
import { response } from 'express';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  credentials!: LoginRequest;
  loginForm!: FormGroup;
  loginSubscription?: Subscription;

  constructor(
    private authService: AuthService,
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
        console.log('successfully login');
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
    // Unsubscribe to prevent memory leaks when the component is destroyed
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
