import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-custom-button-component',
  imports: [CommonModule, MatIconModule,MatTooltipModule],
  templateUrl: './custom-button-component.html',
  styleUrl: './custom-button-component.css'
})
export class CustomButtonComponent {
  @Input() label: string = 'Button';
  @Input() icon?: string; // Material icon name
  @Input() bootstrapIcon?: string; // Bootstrap icon class
  @Input() type: 'primary' | 'navigation' = 'primary';
  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'filled' | 'outlined' = 'filled';
  @Input() disabled: boolean = false;
  @Input() tooltip: string = '';

  hover: boolean = false;
}
