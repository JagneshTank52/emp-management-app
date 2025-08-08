export interface AddEditEmployeeDetails {
    id?: number; // Optional for Add, typically used for Update when sending the full object
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string; // DateOnly from .NET maps to string in Angular (e.g., "YYYY-MM-DD")
    address: string;
    departmentId: number;
    userName: string;
    email: string;
    password: string;
    roleId: number;
}
