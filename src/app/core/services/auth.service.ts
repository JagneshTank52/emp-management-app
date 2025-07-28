import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { catchError, map, Observable, of, pipe, tap, throwError } from 'rxjs';
import { LoginResponse } from '../model/login-response';
import { stringify } from 'querystring';

import { AuthResponse } from '../model/auth-response';
import { ApiResponse } from '../model/api-response';
import { Router } from '@angular/router';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL: string = "https://localhost:7051/api/Auth";

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authURL}/login`, credentials, { withCredentials: true })
      .pipe(
        map(response => {
          console.log(response);
          if (!response.Success || !response.Data) {
            throw new Error(response.Message || 'Login failed');
          }
          return response.Data;
        }),
        tap(data => this.tokenService.setSession(data))
      );
  }

  refreshToken(): Observable<AuthResponse> {
    debugger;
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authURL}/refresh-token`, null, { withCredentials: true })
      .pipe(
        map(response => {
          if (!response.Success || !response.Data) {
            throw new Error(response.Message || 'Token refresh failed');
          }
          return response.Data;
        }),
        tap(data => this.tokenService.setSession(data))
      );
  }

  logout(): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.authURL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.tokenService.clearSession();
      }),
      map(() => true), // Return `true` if success
      catchError(err => {
        console.error('Logout error:', err);
        this.tokenService.clearSession();
        return of(true); // Still return `true` to allow navigation
      })
    );
  }


  isLoggedIn(): boolean {
    return this.tokenService.isAccessTokenExist();
  }
}
