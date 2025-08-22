import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, Subject, tap } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { WorkSheetDetailsModel } from '../model/WorkLog/work-sheet-details-model';
import { WorklogDetailsModel } from '../model/WorkLog/worklog-details-model';

@Injectable({
  providedIn: 'root'
})

export class WorklogService {

  private worklogSubject = new BehaviorSubject<WorklogDetailsModel[]>([]);
  readonly workLogs$ = this.worklogSubject.asObservable();

  private workSheetSubject = new BehaviorSubject<WorkSheetDetailsModel | null>(null);
  readonly workSheet$ = this.workSheetSubject.asObservable();

  private baseURL: string = "http://localhost:5140/api/worklog";

  constructor(private http: HttpClient) { }

  // GET /api/Worklog/work-sheet - Get work sheet for project & month
  getWorkSheet(month: number, year: number, projectId: number): Observable<ApiResponse<WorkSheetDetailsModel>> {
    let params = new HttpParams()
      .set('month', month)
      .set('year', year)
      .set('projectId', projectId);

    return this.http.get<ApiResponse<WorkSheetDetailsModel>>(`${this.baseURL}/work-sheet`, {
      params,
      withCredentials: true
    }).pipe(
      tap(res => this.workSheetSubject.next(res.data! || null)),
      shareReplay({bufferSize: 1, refCount: true})
    );
  }
} 
