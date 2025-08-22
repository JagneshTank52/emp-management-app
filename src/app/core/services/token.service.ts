import { Injectable } from '@angular/core';
import { AuthResponse } from '../model/auth-response';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private cookieService: CookieService
  ) { }

  setSession(authResponse: AuthResponse): void {
    const expiresDate = new Date(authResponse.expiresIn);
    this.cookieService.set('RefreshToken', authResponse.refreshToken, expiresDate, '/', '', false)
    this.cookieService.set('AccessToken', authResponse.accessToken, expiresDate, '/', '', false);
  }

  getAccessToken(): string | null {
    console.log(this.cookieService.get('AccessToken'));
    return this.cookieService.get('AccessToken');
  }

  getRefreshToken(): string | null {
    console.log(this.cookieService.get('RefreshToken'));
    return this.cookieService.get('RefreshToken');
  }

  isTokenExpired(token: string): boolean {
      const decoded: any = jwtDecode(token);

      if (!decoded || !decoded.exp) {
        return true; 
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
  }
  
  isAccessTokenExist(): boolean {
    const token = this.cookieService.get('AccessToken');
    return !!token;
  }

  clearSession(): void {
    this.cookieService.delete('AccessToken');
  }
}
