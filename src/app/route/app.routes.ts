import { Routes } from '@angular/router';
import { MainLayout } from '../layouts/main-layout/main-layout';
import { AuthLayout } from '../layouts/auth-layout/auth-layout';
import { EmployeeList } from '../features/Employee/employee-list/employee-list';
import { EmployeeForm } from '../features/Employee/employee-form/employee-form';
import { EmployeeDetails } from '../features/Employee/employee-details/employee-details';
import { LoginComponent } from '../features/Auth/login.component/login.component';
import { authGuard } from '../core/guards/auth-guard';
import { RegisterComponent } from '../features/Auth/register.component/register.component';
import { DashboardComponent } from '../features/Dashboard/dashboard-component/dashboard-component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  },
  {
    path: "",
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        title: "Dashboard"
      },
      {
        path: "employee",
        canActivateChild: [authGuard],
        children: [
          {
            path: "",
            component: EmployeeList, // Get all employee
            title: "Employee List"
          },

          // POST /api/employee
          {
            path: "create",
            // canActivate: [authGuard],
            component: EmployeeForm, // Add Employee
            title: "Add New Employee"
          },

          // GET /api/employees/{id} - View employee details
          {
            path: ":id",
            // canActivate: [authGuard],
            component: EmployeeDetails, // Get employee detalis
            title: "Employee Details"
          },

          // PUT /api/employees/{id} - Edit employee form
          {
            path: ":id/edit",
            component: EmployeeForm, // Edit Employee
            title: "Edit Employee"
          }
        ]
      },
      {
        path: "project",
        children: [
          {
            path: "",
            component: EmployeeDetails,
            title: "Project List"
          },
          {
            path: ":id/edit",
            component: EmployeeDetails,
            title: "Edit Project"
          }
        ]
      },
      {
        path: "attendance",
        component: EmployeeDetails,
        title: "Attendance"
      }
    ]
  },
  {
    path: "auth",
    component: AuthLayout,
    children:
      [
        {
          path: "login",
          component: LoginComponent,
          title: "Employee Login" // login component
        },

        {
          path: "register",
          component: RegisterComponent // Regiseter component
        }
      ]
  }
];
