import { Component, signal } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/custom-button-component/custom-button-component';
import { MatGridListModule, MatGridTileText } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { WorklogDetailsModel } from '../../../../core/model/WorkLog/worklog-details-model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-task-details',
  imports: [CustomButtonComponent, CommonModule, MatGridListModule, MatTabsModule, MatExpansionModule, MatIconModule, MatTableModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css'
})
export class TaskDetails {
  readonly panelOpenState = signal(false);

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
