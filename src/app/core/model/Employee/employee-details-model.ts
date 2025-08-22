export interface EmployeeDetailsModel {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string; // DateOnly from .NET maps to string in Angular (e.g., "YYYY-MM-DD")
    address: string;
    departmentId: number;
    departmentName: string;
    email: string;
    password?: string; // Password often omitted or optional in DTOs returned to client
    roleId: number;
    roleName: string;
}
