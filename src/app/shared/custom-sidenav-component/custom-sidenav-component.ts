import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-sidenav-component',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './custom-sidenav-component.html',
  styleUrl: './custom-sidenav-component.css'
})
export class CustomSidenavComponent {
  @Input() label!: string;
  @Input() icon?: string;
  @Input() link?: string;

  @Input() expandable = false;
  @Input() expanded = false;

  @Output() toggleExpand = new EventEmitter<void>();
}
