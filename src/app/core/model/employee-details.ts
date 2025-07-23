export interface EmployeeDetailsModel {
    Id: number;
  FirstName: string;
  LastName: string;
  UserName: string;
  PhoneNumber: string;
  Gender: string;
  DateOfBirth: string; // DateOnly from .NET maps to string in Angular (e.g., "YYYY-MM-DD")
  Address: string;
  DepartmentId: number;
  DepartmentName: string;
  Email: string;
  Password?: string; // Password often omitted or optional in DTOs returned to client
  RoleId: number;
  RoleName: string;
}
