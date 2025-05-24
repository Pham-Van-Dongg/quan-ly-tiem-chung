import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { DotTiem } from '../model/model-chung.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DotTiemService {
  private apiUrl = 'https://localhost:7025/api/DotTiems';

  constructor(private http: HttpClient) {}

  getDanhSachDotTiem(): Observable<DotTiem[]> {
    return this.http.get<DotTiem[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(() => new Error('Không thể tải danh sách đợt tiêm.'));
      })
    );
  }

  addDotTiem(dotTiem: DotTiem): Observable<DotTiem> {
    return this.http.post<DotTiem>(`${this.apiUrl}`, dotTiem).pipe(
      catchError((err) => {
        console.error('Lỗi khi thêm đợt tiêm:', err);
        return throwError(() => new Error('Không thể thêm đợt tiêm'));
      })
    );
  }
  getDotTiemId(maDot: number): Observable<DotTiem> {
    return this.http.get<DotTiem>(`${this.apiUrl}/${maDot}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết:', error);
        return throwError(() => new Error('Không thể tải chi tiết đợt tiêm.'));
      })
    );
  }
  updateDotTiem(maDot: number, dotTiem: any): Observable<any> {
    return this.http.put(
      `https://localhost:7025/api/DotTiems/${maDot}`,
      dotTiem
    );
  }
  deleteDotTiem(maDot: number): Observable<any> {
    return this.http.delete(`https://localhost:7025/api/DotTiems/${maDot}`);
  }
}
