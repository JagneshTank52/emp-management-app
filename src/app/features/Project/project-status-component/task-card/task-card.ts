import { Component, Input, NgModule } from '@angular/core';
import { Task } from '../../../../core/model/task';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TaskDetailsModel } from '../../../../core/model/Task/task-details-model';

@Component({
  selector: 'app-task-card',
  imports: [MatOptionModule,CommonModule,MatSelectModule,MatCardModule,MatIconModule,FormsModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css'
})

export class TaskCardComponent {
  @Input() task!: TaskDetailsModel;
  @Input() statusColor!: string;
}
