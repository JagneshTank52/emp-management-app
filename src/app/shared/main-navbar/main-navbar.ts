import { Component } from '@angular/core';
import { ReusableBtn } from '../reusable-btn/reusable-btn';
import { ReusableNavBtn } from '../reusable-nav-btn/reusable-nav-btn';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-navbar',
  imports: [ReusableNavBtn],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css'
})
export class MainNavbar {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout(): void {
    debugger;
    this.authService.logout().subscribe({
      next: (success) => {
        if (success) {
          console.log('Logout successful');
          this.router.navigate(['/auth/login']);
        }
      },
      error: (err) => {
        console.error('Unexpected logout error:', err);
        this.router.navigate(['/auth/login']); 
      }
    });
  }
}
