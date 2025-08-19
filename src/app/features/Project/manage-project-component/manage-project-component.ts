import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Pipe, signal, ViewChild, WritableSignal } from '@angular/core';
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
import { TechnologyDetails } from '../../../core/model/Technology/technology-details';
import { TechnologyService } from '../../../core/services/technology.service';
import { response } from 'express';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDetailsSelectModel } from '../../../core/model/Employee/employee-details-select-model';
import { EmployeeService } from '../../../core/services/employee.service';
import { AddEditProjectDialogData } from '../../../core/model/Project/add-edit-project-dialog-data';
import { CustomButtonComponent } from '../../../shared/custom-button-component/custom-button-component';

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
    ReactiveFormsModule,
    CommonModule,
  CustomButtonComponent],
  templateUrl: './manage-project-component.html',
  styleUrl: './manage-project-component.css'
})
export class ManageProjectComponent implements OnInit {

  message: string = '';
  projectSubscription = new Subscription();
  projects!: ProjectDetailsModel[];
  // public tech: WritableSignal<TechnologyDetails[]> = signal([]);
  technologies!: TechnologyDetails[];
  employeeList!: EmployeeDetailsSelectModel[];

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

  filterForm!: FormGroup;

  pageSizeOptions: number[] = [3, 5, 10, 15, 20, 50];

  displayedColumns: string[] = [
    'code', 'name', 'type', 'tech', 'status',
    'start_date', 'due_date', 'created_at', 'no_of_employee', 'total_hours', 'action'
  ];

  dataTableSource = new MatTableDataSource<ProjectDetailsModel>();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private technologyService: TechnologyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.LoadProjects();
    this.LoadTechnology();
    this.LoadSelectEmployeeList();
    this.initForm();

    this.projectSubscription.add(
      this.projectService.onProjectsUpdated()
        .pipe(debounceTime(1000)).subscribe(() => {
          this.LoadProjects();
        })
    );
  }

  private initForm(): void {
    this.filterForm = this.fb.group({
      name: [''],
      type: [''],
      technologyId: [''],
      status: [''] // instead of "total_hours"
    });
  }

  LoadTechnology() {
    var sub = this.technologyService.getTechnologies().subscribe({
      next: (response) => {
        console.log(response)
        this.technologies = response.Data ?? [];
      }
    })
    this.projectSubscription.add(sub);
  }

  LoadSelectEmployeeList() {
    var sub = this.employeeService.getEmployeeSelectList().subscribe({
      next: (response) => {
        this.employeeList = response.Data ?? [];
      }
    })
    console.log(this.employeeList);
    this.projectSubscription.add(sub);
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

        console.log(this.projects);
        this.dataTableSource.data = this.projects;

        if (this.projects.length === 0) {
          this.message = 'No projects to display.';
        } else {
          this.message = '';
        }

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

  onSearch(): void {
    debugger;
    this.projectQueryParamater.searchTerm = this.filterForm.value.name as string
    this.projectQueryParamater.technologyId = this.filterForm.value.technologyId as number
    this.projectQueryParamater.projectStatus = this.filterForm.value.status as string
    this.projectQueryParamater.type = this.filterForm.value.type as string

    this.LoadProjects();
  }

  openAddEditDialog(projectId: number): void {
    debugger;
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '700px',
      disableClose: true,
      data: {
        Id: projectId,
        technologiesList: this.technologies,
        selectEmployeeList: this.employeeList
      } as AddEditProjectDialogData
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        debugger;
        const currentData = this.dataTableSource.data;

        const newProject = {
          ...result,
          position: currentData.length + 1,
          start_date: new Date(result.start_date).toLocaleDateString('en-CA'),
          due_date: new Date(result.due_date).toLocaleDateString('en-CA'),
          created_at: new Date().toLocaleString(), // Set creation timestamp
        };

        this.dataTableSource.data = [...currentData, newProject];
      }
    });
  }
}
