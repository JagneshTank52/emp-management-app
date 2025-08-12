import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { TechnologyDetails } from '../model/Technology/technology-details';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private baseURL: string = "http://localhost:5140/api/technology";

  constructor(private http: HttpClient) { }

  getTechnologies(): Observable<ApiResponse<TechnologyDetails[]>> {
    return this.http.get<ApiResponse<TechnologyDetails[]>>(this.baseURL, { withCredentials: true });
  }

}
