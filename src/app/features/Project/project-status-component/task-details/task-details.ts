import { Component, OnInit, signal } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/custom-button-component/custom-button-component';
import { MatGridListModule, MatGridTileText } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { WorklogDetailsModel } from '../../../../core/model/WorkLog/worklog-details-model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { WorklogService } from '../../../../core/services/worklog.service';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { WorklogQueryParameter } from '../../../../core/model/QueryParamaters/worklog-query-parameter';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [CustomButtonComponent, CommonModule, MatGridListModule, MatTabsModule, MatExpansionModule, MatIconModule, MatTableModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css'
})
export class TaskDetails implements OnInit {
  readonly panelOpenState = signal(false);
  worklogs$!: Observable<WorklogDetailsModel[]>;
  worklogQueryParameter$ = new BehaviorSubject<WorklogQueryParameter>({
    taskId: null,
    assignedToId: null,
    pageNumber: 1,
    pageSize: 5,
    sortBy: '',
    searchTerm: ''
  });


  constructor(
    private worklogService: WorklogService,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.worklogs$ = this.worklogService.workLogs$

    this.activatedRoute.paramMap.pipe(
      map(params => {
        const taskId = Number(params.get('id'));
        return {
          ...this.worklogQueryParameter$.value,
          taskId: !isNaN(taskId) ? taskId : null
        };

      }),
      switchMap(query => this.worklogService.getAllWorklogs(query)),
    ).subscribe();
  }

  // table columns
  displayedWorklogColumns: string[] = [
    'code',
    'workLogTitle',
    'taskTitle',
    'assignedToName',
    'workDate',
    'taskStatusName',
    'workTimeHours',
    'createdAt',
    'action'
  ];

  worklogs: WorklogDetailsModel[] = [
    {
      Id: 1,
      WorkLogTitle: "xyz",
      Code: "WL100001",
      TaskId: 1,
      TaskCode: "TA100700001",
      TaskTitle: "login FE",
      AssignedToName: "Shubh Shah",
      WorkDate: "2025-08-14T09:11:06.14",
      TaskStatusName: "In Progress",
      TaskStatusColor: "#FFC107",
      WorkTimeHours: 4.6,
      IsEditable: true,
      CreatedAt: "2025-08-14T09:12:53.077",
      UpdatedAt: null
    }

  ];

  onEditWorkLog(log: WorklogDetailsModel): void {
    console.log('Editing work log:', log);
    // open dialog or route to edit page
  }
}
