export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string; // Will be converted to DateTime on backend
    gender: string;
    phoneNumber: string;
    password: string;
}
