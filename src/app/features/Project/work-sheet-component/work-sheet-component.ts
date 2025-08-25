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
import { MinuteToHourPipe } from '../../../shared/pipes/minute-to-hour-pipe';

@Component({
  selector: 'app-work-sheet-component',
  imports: [MatCardModule, MatGridListModule, ReactiveFormsModule, MatIconModule, MinuteToHourPipe, CommonModule, FormsModule, MatTableModule, CustomButtonComponent, MatOptionModule, MatSelectModule],
  templateUrl: './work-sheet-component.html',
  styleUrl: './work-sheet-component.css'
})
export class WorkSheetComponent implements OnInit {
  projectDropDown$!: Observable<DropDownModel[]>;
  worklogFilterForm!: FormGroup;
  selectedMonth = new Date().getMonth() + 1; // August (0-based index)
  selectedYear = new Date().getFullYear();
  workSheet$!: Observable<WorkSheetDetailsModel | null>;
  selectedMonthLabel = '';


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

  displayedColumns: string[] = ['workItem', 'sum'];

  constructor(
    private fb: FormBuilder,
    private worklogService: WorklogService,
    private dropDownService: DropDownService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedMonthLabel = this.getMonthLabel(this.selectedMonth)
    this.initWorklogForm();
    this.generateYears();

  }

  ngOnInit(): void {
    this.projectDropDown$ = this.dropDownService.getDropDownList(DropDownType.Project);

    this.worklogFilterForm.valueChanges.subscribe(val => {
      this.selectedMonthLabel = this.getMonthLabel(val.month);
      this.selectedYear = val.year;
    });

  }

  private initWorklogForm(): void {
    this.worklogFilterForm = this.fb.group({
      project: ['', Validators.required],
      month: [this.selectedMonth, Validators.required],
      year: [this.selectedYear, Validators.required]
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
            this.displayedColumns = ['workItem', 'sum', ...dayColumns];
            this.workSheet$ = this.worklogService.workSheet$;
          },
          error: (err) => console.error('Error fetching worksheet', err)
        });
    }
  }

  onReset(): void {
    this.worklogFilterForm.reset();
  }

  getSumMinutes(task: WorkSheetTaskDetailsModel): number {
    if (!task.workLogDetails || !task.workLogDetails.length) return 0;

    return task.workLogDetails.reduce((sum, log) => sum + (log.workTimeInMinute || 0), 0);
  }

  getMonthLabel(month: number) {
    return new Date(0, (month - 1)).toLocaleString('default', { month: 'long' });
  }



  // Convert date string to day number (1, 2, 3, ...)
  getDayNumber(dateStr: string): number {
    return new Date(dateStr).getDate();
  }

  getDailyHours(task: WorkSheetTaskDetailsModel, dateStr: string): number | null {
    const targetDate = new Date(dateStr);

    const log = task.workLogDetails.find(w => {
      const logDate = new Date(w.attendanceDate); // Convert to Date in case it's a string
      return (
        logDate.getFullYear() === targetDate.getFullYear() &&
        logDate.getMonth() === targetDate.getMonth() &&
        logDate.getDate() === targetDate.getDate()
      );
    });

    console.log(log);
    return log ? log.workTimeInMinute : null;
  }

  // Example: CSS class for a day (enable/disable/highlight)
  getDayClass(day: { attendanceDate: string, day: string }): string {
    // Customize: for example, highlight holidays or weekends
    const date = new Date(day.attendanceDate);
    return (date.getDay() === 0 || date.getDay() === 6) ? 'weekend' : '';
  }

}

