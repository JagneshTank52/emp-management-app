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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../manage-project-component/add-project-dialog.component/add-project-dialog.component';
import { StatusColumn } from '../../../core/model/status-column';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from './status-card.component/status-card.component';
import { CustomButtonComponent } from '../../../shared/custom-button-component/custom-button-component';
import { BehaviorSubject, map, Observable, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { DropDownService } from '../../../core/services/drop-down.service';
import { DropDownType } from '../../../core/model/Common/comman-enums';
import { TaskService } from '../../../core/services/task.service';
import { TaskDetailsModel } from '../../../core/model/Task/task-details-model';
import { error } from 'console';
import { DropDownModel } from '../../../core/model/Common/drop-down-model';
import { RouterModule } from '@angular/router';
import { TaskQueryParamater } from '../../../core/model/QueryParamaters/task-query-paramater';

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
    StatusCardComponent,
    CustomButtonComponent,
    RouterModule
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
  projectDropDown$!: Observable<DropDownModel[]>;
  taskQueryParams$ = new BehaviorSubject<TaskQueryParamater>({
    statusId: null,
    priority: null,
    projectId: null,
    assignedTo: null,
    pageNumber: 1,
    pageSize: 10,
    sortBy: '',
    searchTerm: ''

  });

  constructor(
    private dialog: MatDialog,
    private dropDownService: DropDownService,
    private taskService: TaskService,
  ) { }

  // ngOnInit(): void {

  //   this.loadTaskStatus();
  //   this.taskService.getAllTasks().subscribe();
  //   this.taskService.getTasksGrouped(this.statusColumns).subscribe(columns => {
  //     this.statusColumns = columns;
  //     console.log('after adding task');
  //     console.log(this.statusColumns);
  //   });

  // }

  ngOnInit(): void {
    this.projectDropDown$ = this.dropDownService.getDropDownList(DropDownType.Project);

    // kick off initial load of tasks
    // this.taskService.getAllTasks().subscribe(); // <-- still needed ONCE to populate tasks$

    // load status columns & prepare grouped observable
    // Reactive grouped columns observable
    this.groupedColumns$ = this.dropDownService.getDropDownList(DropDownType.TaskStatus).pipe(
      map(res => res?.length ? this.initColumns(res) : []),
      tap(columns => this.statusColumns = columns),
      switchMap(columns =>
        this.taskQueryParams$.pipe(
          switchMap(params =>
            this.taskService.getAllTasks(params).pipe(
              map(() => columns) // keep columns for grouping
            )
          )
        )
      ),
      switchMap(columns => this.taskService.getTasksGrouped(columns)),
      shareReplay(1)
    );

  }

  // loadTaskStatus() {
  //   this.dropDownService.getDropDownList(DropDownType.TaskStatus).subscribe({
  //     next: (res) => {
  //       if (res && res.length > 0) {
  //         this.statusColumns = this.initColumns(res);
  //       } else {
  //         this.statusColumns = [];
  //       }
  //       console.log('load status');
  //       console.log(this.statusColumns);
  //     },
  //     error: (err) => {
  //       console.error('Failed to load Task Status', err);
  //       this.statusColumns = [];
  //     }
  //   });
  // }

  initColumns(statuses: DropDownModel[]): StatusColumn[] {
    return statuses.map(status => ({
      id: status.Id,
      title: status.Name,
      color: status.Color ?? '#000000',
      tasks: []
    }));
  }

  onSearch(): void {
    const currentParams = this.taskQueryParams$.value;
    this.taskQueryParams$.next({
      ...currentParams,
      projectId: this.selectedProjectId || null
    });
  }

  onReset(): void {
    debugger
    const currentParams = this.taskQueryParams$.value;
    this.selectedProjectId = null; // reset selected project in UI
    this.taskQueryParams$.next({
      ...currentParams,
      projectId: null
    });
  }
}

