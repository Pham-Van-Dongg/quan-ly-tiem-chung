import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DotTiem } from '../model/model-chung.model';
@Injectable({
  providedIn: 'root',
})
export class DotTiemService {
  private apiUrl = 'http://localhost:7025/api/DotTiems';

  constructor(private http: HttpClient) {}

  getDanhSachDotTiem(): Observable<DotTiem[]> {
    return this.http.get<DotTiem[]>(this.apiUrl);
  }

  getDotTiemById(id: number): Observable<DotTiem> {
    return this.http.get<DotTiem>(`${this.apiUrl}/${id}`);
  }

  createDotTiem(dotTiem: Partial<DotTiem>): Observable<DotTiem> {
    return this.http.post<DotTiem>(this.apiUrl, dotTiem);
  }

  updateDotTiem(id: number, dotTiem: Partial<DotTiem>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dotTiem);
  }

  deleteDotTiem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
