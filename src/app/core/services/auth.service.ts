import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { map, Observable, pipe, tap, throwError } from 'rxjs';
import { LoginResponse } from '../model/login-response';
import { stringify } from 'querystring';

import { AuthResponse } from '../model/auth-response';
import { ApiResponse } from '../model/api-response';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL: string = "http://localhost:5140/api/auth";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authURL}/login`, credentials)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
          }
          return response.data;
        }),
        tap(data => this.setSession(data))
      );
  }

  logout(): void {
    const refreshToken = this.getRefreshTokenFromCookie();
    if (refreshToken) {
      this.http.post(`${this.authURL}/logout`, { refreshToken });
    }
    // this.http.post(`${this.authURL}/logout`, { refreshToken }).subscribe({
    //   next: () => { },
    //   error: () => { }
    // });
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    this.router.navigate(['/login']);
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    const cookieOptions = `path=/; Secure; SameSite=Strict;`;
    document.cookie = `refreshToken=${authResponse.refreshToken}; ${cookieOptions}`;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshTokenFromCookie();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http.post<ApiResponse<AuthResponse>>(`${this.authURL}/refresh-token`, { refreshToken })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Token refresh failed');
          }
          return response.data;
        }),
        tap(data => this.setSession(data))
      );
  }

  // private getRefreshTokenFromCookie(): string | null {
  //   const cookieString: string = document.cookie;
  //   const cookieArray: string[] = cookieString.split(';');

  //   for (const cookie of cookieArray) {
  //     const [name, value] = cookie.split('=');

  //     if (name == "refreshToken") {
  //       return value;
  //     }
  //   }
  //   return null;
  // }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshTokenFromCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^| )refreshToken=([^;]+)'));
    return match ? match[2] : null;
  }
}
