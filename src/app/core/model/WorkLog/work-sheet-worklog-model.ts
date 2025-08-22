export interface WorkSheetWorklogModel {
    id: number;
    attendanceDate: Date;  // or string if backend sends as ISO string
    day: string;
    isEnable: boolean;
    isHoliday: boolean;
    workTimeInMinute: number;
}
