import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';
import {
  LichTiem,
  Vaccine,
  DotTiem,
  NguoiDung,
} from '../model/model-chung.model';
@Injectable({ providedIn: 'root' })
export class LichTiemService {
  private apiUrl = 'https://localhost:7025/api/LichTiems';

  constructor(private http: HttpClient) {}

  getDanhSachLichTiem(): Observable<LichTiem[]> {
    return this.http.get<LichTiem[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(
          () => new Error('Không thể tải danh sách lịch tiêm.')
        );
      })
    );
  }
  addLichTiem(lichtiem: LichTiem): Observable<LichTiem> {
    return this.http.post<LichTiem>(`${this.apiUrl}`, lichtiem).pipe(
      catchError((err) => {
        console.error('Lỗi khi thêm lịch tiêm:', err);
        return throwError(() => new Error('Không thể thêm lcịh tiêm.'));
      })
    );
  }
  getLichTiemById(maLichTiem: number): Observable<LichTiem> {
    return this.http.get<LichTiem>(`${this.apiUrl}/${maLichTiem}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết: ', error);
        return throwError(() => new Error('Không thể tải chi tiết lịch tiêm.'));
      })
    );
  }

  updateLichTiem(maLichTiem: number, lichtiem: any): Observable<any> {
    return this.http.put(
      `https://localhost:7025/api/LichTiems/${maLichTiem}`,
      lichtiem
    );
  }
  deleteLichTiem(maLichTiem: number): Observable<any> {
    return this.http.delete(
      `https://localhost:7025/api/LichTiems/${maLichTiem}`
    );
  }
}
