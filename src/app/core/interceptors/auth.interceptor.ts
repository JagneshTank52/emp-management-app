// The HttpInterceptor to automatically handle tokens and 401 errors.

import { HttpInterceptorFn, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../model/auth-response';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  let isRefreshing = false;
  const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  function handle401Error(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap((authResponse: AuthResponse) => {
          isRefreshing = false;
          refreshTokenSubject.next(authResponse.accessToken);
          return next(addTokenToRequest(request, authResponse.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => next(addTokenToRequest(request, jwt!)))
      );
    }
  }

  // Main interception logic
  const accessToken = authService.getAccessToken();
  let authReq = req;
  if (accessToken) {
    authReq = addTokenToRequest(req, accessToken);
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq);
      }
      return throwError(() => error);
    })
  );
};
