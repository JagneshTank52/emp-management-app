import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskDetailsModel } from '../../../../core/model/Task/task-details-model';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list-view',
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule],
  templateUrl: './task-list-view.html',
  styleUrl: './task-list-view.css'
})
export class TaskListView {
  @Input() tasks$!: Observable<TaskDetailsModel[]>;
  @Input() length!: number; // total rows
  @Input() pageSize : number = 5;
  @Output() pageChange = new EventEmitter<PageEvent>();

  displayedColumns: string[] = [
    'code',
    'title',
    'description',
    'project_name',
    'priority',
    'status',
    'start_date',
    'end_date',
    'total_hours',
    'label',
    'assigned_to',
    'action'
  ];

  onEdit(task: TaskDetailsModel) {
    console.log('Edit task', task);

  }
}
