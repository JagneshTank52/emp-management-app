import { HttpErrorResponse, HttpEvent, HttpEventType, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, tap, throwError, BehaviorSubject, switchMap, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    console.log('Token: ',accessToken);
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      debugger;
      // Handle 401 errors
      if (error.status === 401) {
        // const isPublicRoute = req.url.includes('/login') || req.url.includes('/register');
        // const refreshTokenExists = document.cookie.includes('RefreshToken=');

        // if (!refreshTokenExists || isPublicRoute) {
        //   authService.logout(); // optional
        //   return throwError(() => error);
        // }
        console.log('Error status' , error.status)
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            // Retry with new token
            const newToken = response.accessToken || response.access_token || response.token;
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
