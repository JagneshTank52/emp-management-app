import { Component, Input, input } from '@angular/core';
import { StatusCard } from '../status-card.component/status-card';
import { Observable } from 'rxjs';
import { StatusColumn } from '../../../../core/model/status-column';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-dashboard-view',
  imports: [StatusCard,CommonModule],
  templateUrl: './task-dashboard-view.html',
  styleUrl: './task-dashboard-view.css'
})
export class TaskDashboardView {
  @Input()  groupedTaskColumns$!: Observable<StatusColumn[]>;
}
