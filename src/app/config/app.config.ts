import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from '../route/app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { authInterceptor } from '../core/interceptor/auth.interceptor';
import { authGuard } from '../core/guards/auth-guard';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    AuthService,
  ]
};

