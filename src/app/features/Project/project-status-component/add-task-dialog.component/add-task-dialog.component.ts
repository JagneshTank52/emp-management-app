import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-task-dialog',
  imports: [CommonModule,MatDialogModule,MatFormFieldModule,MatOptionModule,MatSelectModule,MatDialogModule,MatNativeDateModule,MatDatepickerModule,ReactiveFormsModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.css'
})
export class AddTaskDialogComponent implements OnInit {
  taskForm!: FormGroup;

  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['New', 'In Progress', 'Dev Complete', 'Ready for Testing', 'Completed'];
  labels: string[] = ['Bug', 'Feature', 'Documentation', 'Support', 'Testing'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projects: any[], users: any[] } // Inject data (projects & users)
  ) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      project_id: ['', Validators.required],
      description: [''], // Description can be optional
      priority: ['Medium', Validators.required],
      status: ['New', Validators.required],
      label: [''], // Label can be optional
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      total_hours: ['', [Validators.required, Validators.min(0)]],
      assigned_to: ['', Validators.required],
      reported_by: ['', Validators.required]
    });
  }


  onSave(): void {
    if (this.taskForm.valid) {
      
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
