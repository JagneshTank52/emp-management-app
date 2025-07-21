import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [
    {
    path: "",
    component: MainLayout,
    children: [
      {
        path: "",
        redirectTo: "/employees",
        pathMatch: "full"
      },
      {
        path: "employees",
        children: [
          {
            path: "",
            component: AuthLayout,
            title: "Employee List"
          },
          
          // Create new employee form (should come before :id route)
          // POST /api/employees
          {
            path: "create",
            component: AuthLayout,
            title: "Add New Employee"
          },
          
          // GET /api/employees/{id} - View employee details
          {
            path: ":id",
            component: AuthLayout,
            title: "Employee Details"
          },
          
          // PUT /api/employees/{id} - Edit employee form
          {
            path: ":id/edit",
            component: AuthLayout,
            title: "Edit Employee"
          }
        ]
      },
      
    ]
  }
];
