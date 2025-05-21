import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DotTiemService {
  private apiUrl = 'http://localhost:7025/api/DotTiems';

  constructor(private http: HttpClient) {}

  layTatCa(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  them(dot: any): Observable<any> {
    return this.http.post(this.apiUrl, dot);
  }

  sua(dot: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${dot.maDot}`, dot);
  }

  xoa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
