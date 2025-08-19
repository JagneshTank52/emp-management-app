import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DropDownType } from '../model/Common/comman-enums';
import { DropDownModel } from '../model/Common/drop-down-model';
import { ApiResponse } from '../model/api-response';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DropDownService {

  private baseURL: string = "http://localhost:5140/api/dropdown/get-drop-down-list/";
  private cache = new Map<DropDownType, BehaviorSubject<DropDownModel[]>>();

  constructor(private http: HttpClient) { }

  // GET /api/DropDown/get-drop-down-list/{type}?filterId={id?}
  // getDropDownList(
  //   type: DropDownType,
  //   filterId: number | null = null
  // ): Observable<ApiResponse<DropDownModel[]>> {
  //   const isStatic = [DropDownType.Technology, DropDownType.TaskStatus].includes(type);

  //   let params = new HttpParams();
  //   if (filterId !== null) {
  //     params = params.set("filterId", filterId.toString());
  //   }

  //   return this.http.get<ApiResponse<DropDownModel[]>>(
  //     `${this.baseURL}/get-drop-down-list/${type}`,
  //     { params, withCredentials: true }
  //   );
  // }

  getDropDownList(type: DropDownType, filterId: number | null = null): Observable<DropDownModel[]> {
    const isStatic = [DropDownType.Technology, DropDownType.TaskStatus].includes(type);

    // If static and already cached → return
    if (isStatic && this.cache.has(type)) {
      return this.cache.get(type)!.asObservable();
    }

    const subject = this.cache.get(type) ?? new BehaviorSubject<DropDownModel[]>([]);
    if (!this.cache.has(type)) this.cache.set(type, subject);

    let params = new HttpParams();
    if (filterId !== null) {
      params = params.set("filterId", filterId.toString());
    }

    // Fetch from API
    this.http.get<ApiResponse<DropDownModel[]>>(this.baseURL+type, { params, withCredentials: true })
      .subscribe({
        next: res => subject.next(res.Data ?? []),
        error: () => subject.next([])
      });

    return subject.asObservable();
  }

  // Call this after creating/updating Project/Employee to refresh
  refresh(type: DropDownType) {
    if (!this.cache.has(type)) return;
    this.http.get<ApiResponse<DropDownModel[]>>(`/api/dropdowns/${type}`)
      .subscribe({
        next: res => this.cache.get(type)!.next(res.Data ?? []),
        error: () => this.cache.get(type)!.next([])
      });
  }
}
