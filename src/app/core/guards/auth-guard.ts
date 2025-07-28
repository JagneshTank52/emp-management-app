import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router)

  debugger; 
  if(authService.isLoggedIn()){
    return true;
  }else{
    router.navigate(['auth','login']);
    return false;
  }
  
};
