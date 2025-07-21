// main-layout.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainNavbar } from '../../shared/main-navbar/main-navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule,MainNavbar,RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})

export class MainLayout {
  appTitle = 'Employee Management';
  showHeader = true;
  showNavigation = true;
  activeTab = 'employees';

}

