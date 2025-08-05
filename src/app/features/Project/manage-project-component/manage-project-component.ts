import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddProjectDialogComponent } from './add-project-dialog.component/add-project-dialog.component';

@Component({
  selector: 'app-manage-project-component',
  imports: [MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
  MatDialogModule],
  templateUrl: './manage-project-component.html',
  styleUrl: './manage-project-component.css'
})
export class ManageProjectComponent {
  displayedColumns: string[] = [
    'position', 'name', 'code', 'type', 'tech', 'status',
    'start_date', 'due_date', 'created_at', 'no_of_employee', 'total_hours', 'action'
  ];

  myDataArray = new MatTableDataSource([
    {
      position: 1,
      name: 'Project Tracker',
      code: 'PRJ-001',
      type: 'Fixed',
      tech: 'Angular',
      status: 'Active',
      start_date: '2025-01-10',
      due_date: '2025-03-20',
      created_at: '2025-01-05 14:23',
      no_of_employee: 6,
      total_hours: 400
    },
    {
      position: 2,
      name: 'Task Manager',
      code: 'PRJ-002',
      type: 'Hourly',
      tech: '.NET',
      status: 'Completed',
      start_date: '2024-10-01',
      due_date: '2024-12-15',
      created_at: '2024-09-25 10:00',
      no_of_employee: 4,
      total_hours: 300
    },
    {
      position: 3,
      name: 'Employee Portal',
      code: 'PRJ-003',
      type: 'Monthly',
      tech: 'Node.js',
      status: 'In Progress',
      start_date: '2025-05-05',
      due_date: '2025-09-10',
      created_at: '2025-04-30 09:45',
      no_of_employee: 8,
      total_hours: 500
    },
    {
      position: 4,
      name: 'UI Redesign',
      code: 'PRJ-004',
      type: 'Cost',
      tech: 'React',
      status: 'On Hold',
      start_date: '2025-02-20',
      due_date: '2025-06-01',
      created_at: '2025-02-10 11:30',
      no_of_employee: 3,
      total_hours: 250
    }
  ]);

  /**
   *
   */
  constructor(private dialog: MatDialog) {
    
  }
  /**
  * Opens the "Add Project" dialog and adds the new project to the table
  * if the user saves it.
  */
  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '700px',
      disableClose: true, // Prevents closing by clicking outside
    });

    dialogRef.afterClosed().subscribe(result => {
     
      if (result) {
        const currentData = this.myDataArray.data;

        const newProject = {
          ...result,
          position: currentData.length + 1,
          start_date: new Date(result.start_date).toLocaleDateString('en-CA'),
          due_date: new Date(result.due_date).toLocaleDateString('en-CA'),
          created_at: new Date().toLocaleString(), // Set creation timestamp
        };

        // Add the new project and refresh the table data
        this.myDataArray.data = [...currentData, newProject];
      }
    });
  }
}
