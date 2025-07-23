export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    employee: {
        id: number;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
        roleName: string;
    };
}
