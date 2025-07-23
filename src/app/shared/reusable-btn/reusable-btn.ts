import { Component,EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reusable-btn',
  standalone: true,
  imports: [],
  templateUrl: './reusable-btn.html',
  styleUrl: './reusable-btn.css'
})
export class ReusableBtn {
  @Input() backgroundColor: string = 'var(--component-secondary-bg-color)'; // Default beige color
  @Input() textColor: string = 'hsla(0, 0%, 100%, 1.00)';
  @Input() borderColor: string = '#d4d4aa';
  @Input() showDropdown: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fontSize: string = '16px';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() customClass: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  get buttonClasses(): string {
    return `btn-base ${this.customClass}`.trim();
  }

  onButtonClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
