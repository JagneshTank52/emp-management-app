import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/login-request';
import { map, Observable, pipe, tap, throwError } from 'rxjs';
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
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authURL}/refresh-token`, null , {withCredentials: true})
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

  logout(): void {
    const refreshToken = this.getRefreshTokenFromCookie();
    if (refreshToken) {
      this.http.post(`${this.authURL}/logout`, { refreshToken });
    }
    // localStorage.removeItem('accessToken');
    // document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    // this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return localStorage.getItem('accessToken') !== null;
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



  private getRefreshTokenFromCookie(): string | null {
    // const match = document.cookie.match(new RegExp('(^| )refreshToken=([^;]+)'));
    // return match ? match[2] : null;
    return 's'
  }
}
