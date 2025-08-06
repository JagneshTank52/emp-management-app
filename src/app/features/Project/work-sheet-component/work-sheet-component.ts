import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-work-sheet-component',
  imports: [MatCardModule, MatGridListModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './work-sheet-component.html',
  styleUrl: './work-sheet-component.css'
})
export class WorkSheetComponent {
  // Data for the filters (can be fetched from a service)
  months = [
    { value: 8, label: 'August-2025' },
    // Add other months
  ];
  projects = [
    { id: '1', name: 'Employee Management' },
    { id: '2', name: 'Project A' },
    { id: '3', name: 'Project B' },
  ];

  tasks = [
    { id: 'PrjBench001', title: 'Bench', assignedTo: 'Admin', color: '#ffecb3', hours: { '2025-08-01': '08:30', '2025-08-04': '08:30' } },
    { id: 'TA111670', title: 'Angular learning', assignedTo: 'John Doe', color: '#b3e5fc', hours: { '2025-08-08': '08:30' } },
    { id: 'TA112379', title: 'Angular learning', assignedTo: 'John Doe', color: '#b3e5fc', hours: { '2025-08-01': '08:30', '2025-08-04': '08:30' } },
  ];

  selectedMonth = 8; // August
  selectedProject = '1'; // Default project
  filteredTasks: any = [];
  daysInMonth: any = [];

  currentUser = 'John Doe';

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateCalendarView();
  }

  getMonthLabel(value: number): string {
    const month = this.months.find(m => m.value === value);
    return month ? month.label : '';
  }
  updateCalendarView(): void {
    this.getDaysInMonth();
    this.filterTasks();
  }

  getDaysInMonth(): void {
    this.daysInMonth = [];
    const date = new Date(2025, this.selectedMonth - 1, 1);
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    while (date.getMonth() === this.selectedMonth - 1) {
      this.daysInMonth.push({
        dayNumber: date.getDate(),
        dayOfWeek: daysOfWeek[date.getDay()],
        date: new Date(date)
      });
      date.setDate(date.getDate() + 1);
    }
  }

  onMonthChange(event: any): void {
    this.selectedMonth = event.value;
    this.updateCalendarView();
  }

  onProjectChange(event: any): void {
    this.selectedProject = event.value;
    this.updateCalendarView();
  }

  filterTasks(): void {
    // If the user is an admin, show all tasks for the selected project.
    // Otherwise, show only tasks assigned to the current user.
    const isAdmin = this.currentUser === 'Admin'; // Simple check for now
    this.filteredTasks = this.tasks.filter(task => {
      const isAssigned = task.assignedTo === this.currentUser || isAdmin;
      // You would also filter by project ID here if tasks had one
      return isAssigned;
    });
  }

  getDailyHours(task: any, date: Date): string | null {
    const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return task.hours[dateStr] || null;
  }

  // openDialog(task: any, date: Date): void {
  //   const dialogRef = this.dialog.open(TimesheetDialogComponent, {
  //     width: '300px',
  //     data: { task: task, date: date, hours: this.getDailyHours(task, date) }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Update task data with new hours
  //       const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  //       task.hours[dateStr] = result;
  //     }
  //   });
}

