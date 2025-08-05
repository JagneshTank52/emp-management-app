import { Component } from '@angular/core';
import { ReusableBtn } from '../reusable-btn/reusable-btn';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ReusableNavBtn } from '../reusable-nav-btn/reusable-nav-btn';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-navbar',
  imports: [RouterModule, CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css'
})
export class MainNavbar {
  private readonly projectRoute = '/project-management';
  private readonly dashboardRoute = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  navigateToProject(routeSuffix: string): void {
    debugger
    this.router.navigate([this.projectRoute,routeSuffix]);
  }
  navigateToDashboard(): void {
    this.router.navigate([this.dashboardRoute]);
  }

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
