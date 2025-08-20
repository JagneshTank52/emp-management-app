import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatTableModule } from '@angular/material/table';
import { MatDialogModule} from '@angular/material/dialog';
import { StatusColumn } from '../../../core/model/status-column';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../../shared/custom-button-component/custom-button-component';
import { BehaviorSubject, map, Observable, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { DropDownService } from '../../../core/services/drop-down.service';
import { DropDownType } from '../../../core/model/Common/comman-enums';
import { TaskService } from '../../../core/services/task.service';
import { TaskDetailsModel } from '../../../core/model/Task/task-details-model';
import { DropDownModel } from '../../../core/model/Common/drop-down-model';
import { RouterModule } from '@angular/router';
import { TaskQueryParamater } from '../../../core/model/QueryParamaters/task-query-paramater';
import { TaskDashboardView } from './task-dashboard-view/task-dashboard-view';
import { TaskListView } from './task-list-view/task-list-view';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-status-component',
  imports: [
    MatCardModule,
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
    MatDialogModule,
    CommonModule,
    CustomButtonComponent,
    CommonModule,
    RouterModule,
    TaskDashboardView,
    TaskListView,
    ReactiveFormsModule
  ],
  templateUrl: './project-status-component.html',
  styleUrl: './project-status-component.css'
})

export class ProjectStatusComponent implements OnInit {

  selectedProjectId: number | null = null;
  taskSubscription = new Subscription();
  statusColumns: StatusColumn[] = [];
  groupedColumns$!: Observable<StatusColumn[]>;
  allTasks: TaskDetailsModel[] = [];
  viewMode$!: Observable<'dashboard' | 'list'>;
  tasks$!: Observable<TaskDetailsModel[]>;
  projectDropDown$!: Observable<DropDownModel[]>;
  taskStatusDropDown$!: Observable<DropDownModel[]>;
  employeeDropDown$!: Observable<DropDownModel[]>;
  totalTasks!: number;
  taskQueryParams$ = new BehaviorSubject<TaskQueryParamater>({
    statusId: null,
    priority: null,
    projectId: null,
    assignedTo: null,
    pageNumber: 1,
    pageSize: 5,
    sortBy: '',
    searchTerm: ''
  });

  taskFilterForm!: FormGroup;

  constructor(
    private dropDownService: DropDownService,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.viewMode$ = this.taskService.viewMode$;
    this.tasks$ = this.taskService.tasks$;
  }

  ngOnInit(): void {

    this.projectDropDown$ = this.dropDownService.getDropDownList(DropDownType.Project);
    this.employeeDropDown$ = this.dropDownService.getDropDownList(DropDownType.Employee);
    this.taskStatusDropDown$ = this.dropDownService.getDropDownList(DropDownType.TaskStatus);

    // load status columns & prepare Reactive grouped columns observable
    this.groupedColumns$ = this.taskStatusDropDown$.pipe(
      map(res => res?.length ? this.initColumns(res) : []),
      tap(columns => this.statusColumns = columns),
      switchMap(columns =>
        this.taskQueryParams$.pipe(
          switchMap(params =>
            this.taskService.getAllTasks(params).pipe(
              tap(response => {
                this.totalTasks = response.Data!.TotalCounts ?? 0
              }),
              map(() => columns)
            )
          )
        )
      ),
      switchMap(columns => this.taskService.getTasksGrouped(columns)),
      shareReplay(1)
    );

    this.initTaskForm();
  }

  private initTaskForm(): void {
    this.taskFilterForm = this.fb.group({
      searchTerm: [''],
      statusId: [''],
      priority: [''],
      assignedTo: [''],
    })
  }

  initColumns(statuses: DropDownModel[]): StatusColumn[] {
    return statuses.map(status => ({
      id: status.Id,
      title: status.Name,
      color: status.Color ?? '#000000',
      tasks: []
    }));
  }

  onSearch(): void {
    const formValue = this.taskFilterForm.value;
    this.taskQueryParams$.next({
      pageNumber: 1,
      pageSize: 5,
      searchTerm: formValue.searchTerm as string,
      statusId: formValue.statusId as number,
      priority: formValue.priority as string,
      assignedTo: formValue.assignedTo as number,
      projectId: this.selectedProjectId || null,
      sortBy: ''
    });
  }

  onReset(): void {
    this.taskFilterForm.reset();
    const formValue = this.taskFilterForm.value;
    this.selectedProjectId = null;
    this.taskQueryParams$.next({
      pageNumber: 1,
      pageSize: 5,
      searchTerm: formValue.searchTerm as string,
      statusId: formValue.statusId as number,
      priority: formValue.priority as string,
      assignedTo: formValue.assignedTo as number,
      projectId: null,
      sortBy: ''
    });
  }

  changeView(mode: 'dashboard' | 'list') {
    this.taskService.setViewMode(mode);
  }

  onPageChange(event: PageEvent): void {
    const currentParams = this.taskQueryParams$.value;
    this.taskQueryParams$.next({
      ...currentParams,
      pageNumber: event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }
}

