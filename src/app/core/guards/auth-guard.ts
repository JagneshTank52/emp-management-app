import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateChildFn = async (route, state) => {

  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  let accessToken = tokenService.getAccessToken();
  const refreshToken = tokenService.getRefreshToken();
  let isValid = accessToken && !tokenService.isTokenExpired(accessToken);

  if (!isValid && refreshToken) {
    const response = await firstValueFrom(authService.refreshToken())
    accessToken = response.AccessToken;
    isValid = !!tokenService;
  }

  if (!isValid) {
    router.navigate(['auth', 'login']);
    return false;
  }

  return true;
};
