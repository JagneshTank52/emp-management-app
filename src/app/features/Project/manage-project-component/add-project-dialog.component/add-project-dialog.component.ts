import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-project-dialog.component',
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css'
})

export class AddProjectDialogComponent {
  projectForm: FormGroup;
  // Injects a reference to the dialog that's opening this component
  readonly dialogRef = inject(MatDialogRef<AddProjectDialogComponent>);

  constructor(private fb: FormBuilder) {
    // Initialize the form with controls and validators
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      type: ['', Validators.required],
      tech: ['', Validators.required],
      status: ['In Progress', Validators.required],
      start_date: [null, Validators.required],
      due_date: [null, Validators.required],
      no_of_employee: ['', [Validators.required, Validators.min(1)]],
      total_hours: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onCancel(): void {
    // Closes the dialog without sending any data
    this.dialogRef.close();
  }

  onSave(): void {
    // If the form is valid, close the dialog and pass the form's value back
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }
}
