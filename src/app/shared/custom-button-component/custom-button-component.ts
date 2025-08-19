import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-button-component',
  imports: [CommonModule, MatIconModule],
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

  hover: boolean = false;
}
