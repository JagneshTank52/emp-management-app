import { Component, Input } from '@angular/core';
import { StatusColumn } from '../../../../core/model/status-column';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TaskCardComponent } from '../task-card/task-card';

@Component({
  selector: 'app-status-card',
  imports: [CommonModule,MatCardModule, TaskCardComponent],
  templateUrl: './status-card.html',
  styleUrl: './status-card.css'
})
export class StatusCard {
  @Input() statusColumn!: StatusColumn;
}
