export interface ApiResponse<T> {
    Success: boolean;
    Message: string;
    StatusCode: number;
    Data?: T;
    Errors?: object;
}
