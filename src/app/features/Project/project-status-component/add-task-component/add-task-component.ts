import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CustomButtonComponent } from '../../../../shared/custom-button-component/custom-button-component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DropDownModel } from '../../../../core/model/Common/drop-down-model';
import { Observable, tap } from 'rxjs';
import { TaskService } from '../../../../core/services/task.service';
import { DropDownService } from '../../../../core/services/drop-down.service';
import { DropDownType } from '../../../../core/model/Common/comman-enums';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailsModel } from '../../../../core/model/Task/task-details-model';

@Component({
  selector: 'app-add-task-component',
  imports: [MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    CustomButtonComponent,
    MatDatepickerModule],
  templateUrl: './add-task-component.html',
  styleUrl: './add-task-component.css'
})
export class AddTaskComponent implements OnInit {

  taskForm!: FormGroup;
  title: string = 'Add Task';
  isEditMode: boolean = false;
  taskId: number | null = null;

  projectDropDown$!: Observable<DropDownModel[]>;
  taskStatusDropDown$!: Observable<DropDownModel[]>;
  employeeDown$!: Observable<DropDownModel[]>;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dropDownService: DropDownService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {

    this.loadDropdowns();

    // Check if editing
    this.taskId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEditMode = true;
      this.title = 'Edit Task';
      this.loadTaskForEdit(this.taskId);
    }
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      taskStatusId: ['', Validators.required],
      projectId: ['', Validators.required],
      labels: [''],
      totalHours: [0],
      startDate: [null],
      endDate: [null],
      assignedTo: ['', Validators.required],
      reportedBy: ['', Validators.required],
      priority: [''],
      label: [''],
      description: ['']
    });
  }

  private loadDropdowns(): void {
    this.projectDropDown$ = this.dropDownService.getDropDownList(DropDownType.Project);
    this.taskStatusDropDown$ = this.dropDownService.getDropDownList(DropDownType.TaskStatus);
    this.employeeDown$ = this.dropDownService.getDropDownList(DropDownType.Employee);
  }

  private loadTaskForEdit(id: number): void {
    this.taskService.getTaskById(id).pipe(
      tap(response => {
        this.taskForm.patchValue({
          title: response.Title,
          description: response.Description ?? '',
          projectId: response.ProjectId,
          taskStatusId: response.StatusId,
          totalHour: response.TotalHours,
          startDate: response.StartDate ? new Date(response.StartDate) : null,
          endDate: response.EndDate ? new Date(response.EndDate) : null,
          assignedTo: response.AssignedTo,
          reportedBy: response.ReportedBy,
          priority: response.Priority ?? 'Low',
          label: response.Label ?? '',
          labels: response.Label ?? ''
        });
      })
    ).subscribe({
      error: (err) => console.error('Error loading task for edit:', err)
    });
  }


  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      //  this.toast.error('Please fix validation errors.');
      return;
    }

    const formValue = this.taskForm.value;
    const taskData = {
      id: this.isEditMode && this.taskId ? this.taskId : 0,
      title: formValue.title,
      description: formValue.description ?? '',
      projectId: formValue.projectId,
      assignedTo: formValue.assignedTo,
      reportedBy: formValue.reportedBy,
      statusId: formValue.taskStatusId,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      totalHours: formValue.estimatedHours ?? 0,
      priority: formValue.priority ?? 'Low',
      label: formValue.label ?? ''
    };

    const request$: Observable<TaskDetailsModel> = this.isEditMode
      ? this.taskService.updateTask(this.taskId!, taskData)
      : this.taskService.addTask(taskData);

    request$
      .subscribe({
        next: (response) => {
          // this.isLoading = false;
          // this.toast.success(`Task ${this.isEditMode ? 'updated' : 'created'} successfully`);
          this.router.navigate(['/project-status']);
        },
        error: (err) => {
          // this.isLoading = false;
          console.error('Task save error:', err);
          // this.toast.error('Something went wrong. Please try again.');
        }
      });
  }

  onCancel(): void {
     this.taskForm.reset();
    this.router.navigate(['/project-status']);
  }
}
