import { Routes } from '@angular/router';
import { MainLayout } from '../layouts/main-layout/main-layout';
import { AuthLayout } from '../layouts/auth-layout/auth-layout';
import { EmployeeList } from '../features/home/employee-list/employee-list';
import { EmployeeForm } from '../features/home/employee-form/employee-form';
import { EmployeeDetails } from '../features/home/employee-details/employee-details';

export const routes: Routes = [
  {
    path: "",
    component: MainLayout,
    children: [
      {
        path: "",
        redirectTo: "/employee",
        pathMatch: "full"
      },
      {
        path: "employee",
        children: [
          {
            path: "",
            component: EmployeeList, // Get all employee
            title: "Employee List"
          },

          // POST /api/employee
          {
            path: "create",
            component: EmployeeForm, // Add Employee
            title: "Add New Employee"
          },

          // GET /api/employees/{id} - View employee details
          {
            path: ":id",
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

    ]
  },
  {
    path: "auth",
    component: AuthLayout,
    children: 
    [
      {
        path: "login",
        component: AuthLayout // login component
      },
      {
        path: "Register",
        component: AuthLayout // Regiseter component
      }
    ]
  }
];
