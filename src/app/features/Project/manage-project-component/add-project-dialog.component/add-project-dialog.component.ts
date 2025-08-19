import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { AddEditProjectModel } from '../../../../core/model/Project/add-edit-project-model';
import { ProjectService } from '../../../../core/services/project.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TechnologyDetails } from '../../../../core/model/Technology/technology-details';
import { AddEditProjectDialogData } from '../../../../core/model/Project/add-edit-project-dialog-data';
import { EmployeeDetailsSelectModel } from '../../../../core/model/Employee/employee-details-select-model';

@Component({
  selector: 'app-add-project-dialog.component',
  imports: [ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule],
  templateUrl: './add-project-dialog.component.html',
  styleUrl: './add-project-dialog.component.css'
})

export class AddProjectDialogComponent implements OnInit {

  title: string = 'Add New Project';
  projectForm!: FormGroup;
  isEditMode: boolean = false;
  projectId: number | null = null;
  technologies!: TechnologyDetails[];
  employeeList!: EmployeeDetailsSelectModel[];
  routeSubscription?: Subscription;
  projectDataSubscription!: Subscription;

  readonly dialogRef = inject(MatDialogRef<AddProjectDialogComponent>);

  constructor(
    private fb: FormBuilder,
  private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private ref: MatDialogRef<AddProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditProjectDialogData) {
    this.initForm();

    if (data?.Id && data.Id !== 0) {
      this.isEditMode = true;
      this.projectId = data.Id;
      this.title = 'Edit Project';
      this.loadProjectForEdit(this.projectId);
    }
    else {
      this.title = "Add New Project";
      this.isEditMode = false;
      this.projectId = null;
      this.projectForm.reset();
    }
  }

  ngOnInit(): void {
    this.technologies = this.data.technologiesList;
    this.employeeList = this.data.selectEmployeeList;
    console.log(this.employeeList)
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      technologyId: [0, Validators.required],
      projectStatus: ['In Progress', Validators.required],
      startDate: [null, Validators.required],
      assignedEmployees: [[], Validators.minLength(1)],
      estimatedDueDate: [null, Validators.required],
      estimatedHours: ['', [Validators.required, Validators.min(1)]]
    });
  }

  private loadProjectForEdit(id: number): void {
    debugger;
    this.projectDataSubscription = this.projectService.getProjectById(id).subscribe({
      next: (response) => {
        this.projectForm.patchValue({
          name: response.Name,
          type: response.Type,
          technologyId: response.TechnologyId,
          projectStatus: response.ProjectStatus,
          startDate: response.StartDate,
          estimatedDueDate: response.EstimatedDueDate,
          estimatedHours: response.EstimatedHours,
          assignedEmployees: []
          // AssignedEmployeeIds: formValue.assignedEmployees 
        });
      },
      error: (err) => {
        console.error('Error loading employee for edit:', err);
      }
    });
  }

  onSave(): void {
    if (this.projectForm.valid) {
      debugger;
      const formValue = this.projectForm.value;
      const projectData = {
        Id: formValue.Id,
        Name: formValue.name,
        Type: formValue.type,
        TechnologyId: Number(formValue.technologyId),
        ProjectStatus: formValue.projectStatus,
        StartDate: formValue.startDate,
        EstimatedDueDate: formValue.estimatedDueDate,
        EstimatedHours: Number(formValue.estimatedHours),
        AssignedEmployeeIds: formValue.assignedEmployees
      };

      if (this.isEditMode && this.projectId) {
        projectData.Id = this.projectId;

        this.projectService.updateProject(this.projectId, projectData as AddEditProjectModel).subscribe({
          next: (response) => {
            console.log('project updated:', response);
            this.ref.close(response);
          },
          error: (response) => {
            console.error('Error updating employee:', response);
          }
        });
      } else {
        this.projectService.addProject(projectData).subscribe({
          next: (response) => {
            this.projectForm.reset();
            console.log('project added:', response);
            this.ref.close(response);
          },
          error: (response) => {
            console.error('Error updating project:', response);
          }
        });
      }
    } else {
      console.log('form is not validate')
      this.projectForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.projectForm.reset();
    this.ref.close();
  }

}

