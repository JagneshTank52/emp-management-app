import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reusable-nav-btn',
  imports: [],
  templateUrl: './reusable-nav-btn.html',
  styleUrl: './reusable-nav-btn.css'
})

export class ReusableNavBtn {
  @Input() backgroundColor: string = 'var(--component-primary-bg-color)'; // Default beige color
  @Input() textColor: string = 'var(-secondary-color)';
  @Input() borderColor: string = 'var(--component-primary-bg-color)';
  @Input() showDropdown: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fontSize: string = '18px';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() customClass: string = '';

  @Output() buttonClick = new EventEmitter<void>();

  get buttonClasses(): string {
    return `nav-btn ${this.customClass}`.trim();
  }

  onButtonClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
