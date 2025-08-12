import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Pipe, ViewChild } from '@angular/core';
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
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddProjectDialogComponent } from './add-project-dialog.component/add-project-dialog.component';
import { ProjectService } from '../../../core/services/project.service';
import { debounceTime, pipe, Subscription } from 'rxjs';
import { ProjectDetailsModel } from '../../../core/model/Project/project-details-model';
import { CommonModule } from '@angular/common';
import { ProjectQueryParamater } from '../../../core/model/QueryParamaters/project-query-paramater';

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
    MatPaginatorModule,
    MatDialogModule,
    CommonModule],
  templateUrl: './manage-project-component.html',
  styleUrl: './manage-project-component.css'
})
export class ManageProjectComponent implements OnInit {
  message: string = '';
  projectSubscription = new Subscription();
  projects!: ProjectDetailsModel[];

  projectQueryParamater: ProjectQueryParamater = {
    pageNumber: 1,
    pageSize: 5,
    sortBy: '',
    searchTerm: '',
    technologyId: null as number | null,
    projectStatus: '',
    type: ''
  };
  totalProjects = 0;

  pageSizeOptions: number[] = [3, 5, 10, 15, 20, 50];
  // startCount: number = 0;
  // endCount: number = 0;

  displayedColumns: string[] = [
    'code', 'name', 'type', 'tech', 'status',
    'start_date', 'due_date', 'created_at', 'no_of_employee', 'total_hours', 'action'
  ];

  dataTableSource = new MatTableDataSource<ProjectDetailsModel>();

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef
  ) { }

  // ngAfterViewInit(): void {
  //   this.dataTableSource.paginator = this.paginator;
  // }

  ngOnInit(): void {
    this.LoadProjects();

    this.projectSubscription.add(
    this.projectService.onProjectsUpdated()
    .pipe(debounceTime(1000)).subscribe(() => {
      this.LoadProjects();
    })
  );
  }

  LoadProjects() {
    var sub = this.projectService.getAllProjects(this.projectQueryParamater).subscribe({
      next: (response) => {
        debugger;
        console.log('response: ', response);

        this.projects = response.Data?.Items ?? [];
        this.projectQueryParamater.pageNumber = response.Data?.PageIndex ?? 1;
        this.projectQueryParamater.pageSize = response.Data?.PageSize ?? this.projectQueryParamater.pageSize;
        this.totalProjects = response.Data?.TotalCounts ?? 0;
        // this.hasNextPage = response.Data?.HasNextPage ?? false;
        // this.hasPreviousPage = response.Data?.HasPreviousPage ?? false;

        // this.startCount = (this.pageNumber - 1) * this.pageSize + 1;
        // this.endCount = Math.min(this.pageNumber * this.pageSize, this.totalProjects);

        console.log(this.projects);
        this.dataTableSource.data = this.projects;

        this.cdr.detectChanges();

        if (this.projects.length === 0) {
          this.message = 'No projects to display.';
        } else {
          this.message = '';
        }
        // this.endCount = Math.min(this.pageNumber * this.pageSize, this.totalProjects);

        this.cdr.detectChanges();

        if (this.projects.length === 0) {
          this.message = 'No employees to display.';
        } else {
          this.message = '';
        }
      }
    });
    this.projectSubscription.add(sub);
  }

  onPageChange(event: PageEvent): void {
    this.projectQueryParamater.pageNumber = event.pageIndex + 1;
    this.projectQueryParamater.pageSize = event.pageSize;

    this.LoadProjects();
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
        const currentData = this.dataTableSource.data;

        const newProject = {
          ...result,
          position: currentData.length + 1,
          start_date: new Date(result.start_date).toLocaleDateString('en-CA'),
          due_date: new Date(result.due_date).toLocaleDateString('en-CA'),
          created_at: new Date().toLocaleString(), // Set creation timestamp
        };

        // Add the new project and refresh the table data
        this.dataTableSource.data = [...currentData, newProject];
      }
    });
  }

  openAddEditDialog(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '50%',
      disableClose: false, // Prevents closing by clicking outside
    });
  }
}
