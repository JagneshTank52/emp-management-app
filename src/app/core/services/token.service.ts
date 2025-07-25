import { Injectable } from '@angular/core';
import { AuthResponse } from '../model/auth-response';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private cookieService: CookieService
  ) { }

  setSession(authResponse: AuthResponse): void {
    const expiresDate = new Date(authResponse.ExpiresIn);

    this.cookieService.set('AccessToken', authResponse.AccessToken, expiresDate,'/','',false,'Lax');
  }

  getAccessToken(): string | null {
    console.log(this.cookieService.get('AccessToken'));
    return this.cookieService.get('AccessToken');

  }
}
