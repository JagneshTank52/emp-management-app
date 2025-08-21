import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [MatCardModule, MatGridListModule, ReactiveFormsModule,MatIconModule, CommonModule, FormsModule, MatTableModule, CustomButtonComponent, MatOptionModule, MatSelectModule],
  templateUrl: './work-sheet-component.html',
  styleUrl: './work-sheet-component.css'
})
export class WorkSheetComponent {
  worklogFilterForm!: FormGroup;
  selectedMonth = 8; // August (0-based index)
  selectedYear = 2025;

  legends = [
    { label: 'Absent', color: 'var(--color-absent)' },
    { label: 'First/Second Half Present', color: 'var(--color-half-present)' },
    { label: 'Today', color: 'var(--color-today)' },
    { label: 'Weekend', color: 'var(--color-weekend)' },
    { label: 'Holiday', color: 'var(--color-holiday)' },
  ];

  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  years: number[] = [];

  daysInMonth = this.getDaysInMonth(this.selectedYear, this.selectedMonth);

  displayedColumns = [
    'workItem', 'p', 'sum',
    ...this.daysInMonth.map(d => d.date)
  ];

  filteredTasks = [
    {
      id: 'Task 1',
      title: 'Bench',
      p: '00:00',
      sum: '42:30',
      color: '#f5faff',
      hours: { '2025-08-01': '08:30', '2025-08-04': '08:30' }
    },
    {
      id: 'Task 2',
      title: 'Development',
      p: '04:00',
      sum: '56:15',
      color: '#fff5f5',
      hours: { '2025-08-02': '04:00', '2025-08-05': '08:00', '2025-08-07': '06:15' }
    },
    {
      id: 'Task 3',
      title: 'Testing',
      p: '02:30',
      sum: '24:45',
      color: '#f5fff5',
      hours: { '2025-08-03': '02:30', '2025-08-06': '08:15' }
    },
  ];

  constructor(
    private fb: FormBuilder
  ) {
    this.initWorklogForm();
    this.generateYears();
  }

  private initWorklogForm(): void {
    this.worklogFilterForm = this.fb.group({
      project: ['', Validators.required],
      month: [new Date().getMonth() + 1, Validators.required],
      year: [new Date().getFullYear(), Validators.required]
    });
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }


  onSearch(): void {
    debugger
    if (this.worklogFilterForm.valid) {
      console.log('Filter values:', this.worklogFilterForm.value);
    }
  }

  onReset(): void {
    this.worklogFilterForm.reset();
  }

  getMonthLabel(month: number) {
    return new Date(0, (month - 1)).toLocaleString('default', { month: 'long' });
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

