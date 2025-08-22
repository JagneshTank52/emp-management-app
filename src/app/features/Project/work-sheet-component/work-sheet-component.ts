import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CustomButtonComponent } from '../../../shared/custom-button-component/custom-button-component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { WorklogService } from '../../../core/services/worklog.service';
import { Observable, tap } from 'rxjs';
import { DropDownModel } from '../../../core/model/Common/drop-down-model';
import { DropDownService } from '../../../core/services/drop-down.service';
import { DropDownType } from '../../../core/model/Common/comman-enums';
import { WorkSheetTaskDetailsModel } from '../../../core/model/WorkLog/work-sheet-task-details-model';
import { WorkSheetDetailsModel } from '../../../core/model/WorkLog/work-sheet-details-model';

@Component({
  selector: 'app-work-sheet-component',
  imports: [MatCardModule, MatGridListModule, ReactiveFormsModule, MatIconModule, CommonModule, FormsModule, MatTableModule, CustomButtonComponent, MatOptionModule, MatSelectModule],
  templateUrl: './work-sheet-component.html',
  styleUrl: './work-sheet-component.css'
})
export class WorkSheetComponent implements OnInit {
  projectDropDown$!: Observable<DropDownModel[]>;
  worklogFilterForm!: FormGroup;
  selectedMonth = 8; // August (0-based index)
  selectedYear = 2025;
  workSheet$!: Observable<WorkSheetDetailsModel | null>;

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

  displayedColumns: string[] = ['workItem','sum'];

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
    private fb: FormBuilder,
    private worklogService: WorklogService,
    private dropDownService: DropDownService,
    private cdr: ChangeDetectorRef
  ) {
    this.initWorklogForm();
    this.generateYears();

  }
  ngOnInit(): void {
    this.projectDropDown$ = this.dropDownService.getDropDownList(DropDownType.Project);

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
      const { month, year, project } = this.worklogFilterForm.value;

      this.worklogService.getWorkSheet(month, year, project)
        .subscribe({
          next: (response) => {
            console.log(response.data);
            const workSheet = response.data?.dailyWorkLogs;
            console.log('Worksheet details:', workSheet);
            debugger
            const dayColumns = workSheet?.map(d => d.attendanceDate) || [];
            this.displayedColumns = ['workItem','sum', ...dayColumns];
            this.workSheet$ = this.worklogService.workSheet$;
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error fetching worksheet', err)
        });
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


  getDailyWorkLog(date: string) {
    return '08:30';
  }

  getDailyTimeLog(date: string) {
    return '08:00';
  }

  // Convert date string to day number (1, 2, 3, ...)
  getDayNumber(dateStr: string): number {
    return new Date(dateStr).getDate();
  }

  getDailyHours(task: WorkSheetTaskDetailsModel, dateStr: string): number | null {
    const log = task.workLogDetails.find(w => w.attendanceDate.toISOString().startsWith(dateStr));
    return log ? log.workTimeInMinute : null;
  }

  // Example: CSS class for a day (enable/disable/highlight)
  getDayClass(day: { attendanceDate: string, day: string }): string {
    // Customize: for example, highlight holidays or weekends
    const date = new Date(day.attendanceDate);
    return (date.getDay() === 0 || date.getDay() === 6) ? 'weekend' : '';
  }

}

