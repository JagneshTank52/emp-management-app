import { Component, OnInit, ViewChild } from '@angular/core';
import { ReusableNavBtn } from '../reusable-nav-btn/reusable-nav-btn';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-main-navbar',
  imports: [ReusableNavBtn, AvatarModule, CommonModule,
    MenuModule, PopoverModule,
    ButtonModule,
  ],
  templateUrl: './main-navbar.html',
  styleUrl: './main-navbar.css'
})

export class MainNavbar implements OnInit {
  menuItems: MenuItem[] = [];
  selectedMember!: MenuItem;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  @ViewChild('menu') menu!: Menu;
  
  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'My Profile',
        icon: 'pi pi-user',
        command: () => this.goToProfile()
      },
      {
        label: 'Change Password',
        icon: 'pi pi-lock',
        command: () => this.changePassword()
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }
  toggleMenu(event: Event) {
    this.menu.toggle(event);
  }

  selectMember(member: MenuItem) {
    this.selectedMember = member
  }

  goToProfile() {
    console.log("Navigating to profile...");
    // this.router.navigate(['/profile']);
  }

  changePassword() {
    console.log("Navigating to change-password...");
    // this.router.navigate(['/change-password']);
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
