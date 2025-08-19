import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CustomButtonComponent } from '../../../shared/custom-button-component/custom-button-component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-work-sheet-component',
  imports: [MatCardModule, MatGridListModule, MatIconModule, CommonModule, FormsModule,MatTableModule,CustomButtonComponent,MatOptionModule,MatSelectModule],
  templateUrl: './work-sheet-component.html',
  styleUrl: './work-sheet-component.css'
})
export class WorkSheetComponent {
  selectedMonth = 7; // August (0-based index)
  selectedYear = 2025;

  legends = [
    { label: 'Absent', color: 'var(--color-absent)' },
    { label: 'First/Second Half Present', color: 'var(--color-half-present)' },
    { label: 'Today', color: 'var(--color-today)' },
    { label: 'Weekend', color: 'var(--color-weekend)' },
    { label: 'Holiday', color: 'var(--color-holiday)' },
  ];

  daysInMonth = this.getDaysInMonth(this.selectedYear, this.selectedMonth);

  displayedColumns = [
    'workItem', 'p', 'sum',
    ...this.daysInMonth.map(d => d.date)
  ];

  filteredTasks = [
    {
      id: 'PrjBench001',
      title: 'Bench',
      p: '00:00',
      sum: '42:30',
      color: '#f5faff',
      hours: { '2025-08-01': '08:30', '2025-08-04': '08:30' }
    }
  ];

  getMonthLabel(month: number) {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  }

  getDaysInMonth(year: number, month: number) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push({
        date: date.toISOString().split('T')[0],
        dayNumber: date.getDate(),
        dayOfWeek: date.toLocaleString('default', { weekday: 'short' })
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  getDailyHours(task: any, date: string) {
    return task.hours[date] || '';
  }

  getDayClass(day: any) {
    const weekday = day.dayOfWeek;
    if (weekday === 'Sat' || weekday === 'Sun') return 'weekend';
    return '';
  }

  getDailyWorkLog(date: string) {
    return '08:30';
  }

  getDailyTimeLog(date: string) {
    return '08:00';
  }
}

