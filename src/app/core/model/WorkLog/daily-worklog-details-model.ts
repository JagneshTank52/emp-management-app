export interface DailyWorklogDetailsModel {
    attendanceDate: string;
    day: string; // Sunday, Monday...
    weeklyTotalTimeInMinutes: number | null;
    dailyWorkLoginMinutes: number;
}
