// main-layout.component.ts
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainNavbar } from '../../shared/main-navbar/main-navbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CustomSidenavComponent } from '../../shared/custom-sidenav-component/custom-sidenav-component';
import {MatTreeModule} from '@angular/material/tree';
import { SidenavItem } from '../../core/model/Common/sidenav-item';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, CustomSidenavComponent,MatTreeModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})

export class MainLayout {

  appTitle = 'Employee Management';
  activeTab = 'employees';

  navItems: SidenavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Employee', icon: 'people', link: '/employee' },
    {
      label: 'Project',
      icon: 'domain',
      children: [
        { label: 'Manage Project', link: '/project-management/manage-project' },
        { label: 'Project Status',  link: '/project-management/project-status' },
        { label: 'Worksheet', link: '/project-management/work-sheet' }
      ]
    },
    { label: 'Attendance', icon: 'assignment_turned_in', link: '/recruitments' },
  ];

  childrenAccessor = (node: SidenavItem) => node.children ?? [];
  hasChild = (_: number, node: SidenavItem) => !!node.children && node.children.length > 0;

  protected readonly fillerNav = Array.from({ length: 10 }, (_, i) => `Nav Item ${i + 1}`);

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 992px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  protected readonly shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(
    window.location.host
  );

}

