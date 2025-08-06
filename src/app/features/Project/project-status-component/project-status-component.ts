import { Component, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../manage-project-component/add-project-dialog.component/add-project-dialog.component';
import { StatusColumn } from '../../../core/model/status-column';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from './status-card.component/status-card.component';
import { AddTaskDialogComponent } from './add-task-dialog.component/add-task-dialog.component';

@Component({
  selector: 'app-project-status-component',
  imports: [
    MatCardModule,
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
    MatDialogModule,
    CommonModule,
    StatusCardComponent
  ],
  templateUrl: './project-status-component.html',
  styleUrl: './project-status-component.css'
})

export class ProjectStatusComponent implements OnInit {
  statusColumns: StatusColumn[] = [];

  projects = [
    { id: 1, name: 'Website Redesign', code: 'PRJ-005' },
    { id: 2, name: 'Mobile App Development', code: 'PRJ-006' },
    { id: 3, name: 'API Integration', code: 'PRJ-007' }
  ];

  users = [
    { id: 101, name: 'Alice Johnson (Admin)' },
    { id: 102, name: 'Bob Williams' },
    { id: 103, name: 'Charlie Brown' }
  ];

  ngOnInit(): void {

    this.statusColumns = [
      {
        id: 1,
        title: 'New',
        color: '#7e57c2',
        tasks: [
          { id: 'TA112379', title: 'Angular learning', priority: 'Medium', assignee: 'Jagnesh Tank' },
          { id: 'TA112379', title: 'Angular learning', priority: 'Medium', assignee: 'Jagnesh Tank' },
          { id: 'TA112380', title: 'Create login page', priority: 'High', assignee: 'Jane Doe' }
        ]
      },
      {
        id: 2,
        title: 'In-Progress',
        color: '#ffb74d',
        tasks: [
          { id: 'TA112381', title: 'Fix button alignment', priority: 'Low', assignee: 'John Smith' }
        ]
      },
      {
        id: 3,
        title: 'Dev Completed',
        color: '#81c784',
        tasks: [
        ]
      },
      {
        id: 4,
        title: 'Ready for Testing',
        color: '#e57373',
        tasks: [
          { id: 'TA112370', title: 'Deploy version 1.0', priority: 'High', assignee: 'Admin' }
        ]
      },
      {
        id: 5,
        title: 'Closed',
        color: '#4fc3f7',
        tasks: [
          { id: 'TA112370', title: 'Deploy version 1.0', priority: 'High', assignee: 'Admin' }
        ]
      }
    ];
  }

  constructor(private dialog: MatDialog) {

  }
  /**
  * Opens the "Add Project" dialog and adds the new project to the table
  * if the user saves it.
  */
  openAddProjectDialog(): void {
    const dialogRef: MatDialogRef<AddTaskDialogComponent> = this.dialog.open(AddTaskDialogComponent, {
      width: '800px', // A wider dialog for this form
      disableClose: true, // User must click a button to close
      data: { // Pass the necessary data to the dialog
        projects: this.projects,
        users: this.users
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);

        // Here you would typically call a service to save the new task to your backend.
        // The backend should generate the 'id' and 'created_at' timestamp.
        // For this example, we'll create the full object on the client side.

        const newTask = {
          ...result,
          id: Math.floor(Math.random() * 1000), // Placeholder ID
          created_at: new Date().toISOString(), // Use ISO string for consistency
          // Format dates if needed, though keeping them as Date objects is often better
          start_date: new Date(result.start_date),
          end_date: new Date(result.end_date)
        };

        const targetColumn = this.statusColumns.find(column => column.title === result.status);

        if (targetColumn) {
          targetColumn.tasks.push({
            id: `TA${newTask.id}`, // Optional formatting of ID
            title: newTask.title,
            priority: newTask.priority,
            assignee: newTask.assigned_to
          });

          // Add the new task to your local data array to update the UI


          // If using MatTableDataSource, you would do:
          // const currentData = this.dataSource.data;
          // this.dataSource.data = [...currentData, newTask];
        }
      }});
  };

}

