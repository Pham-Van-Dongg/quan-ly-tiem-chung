import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NguoiDung } from '../model/model-chung.model';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class NguoidanService {
  private apiUrl = 'https://localhost:7025/api/NguoiDans';
  constructor(private http: HttpClient) {}

  getDanhSachNguoiDan(): Observable<NguoiDung[]> {
    return this.http.get<NguoiDung[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(
          () => new Error('Không thể tải danh sách người dân.')
        );
      })
    );
  }
  getNguoiDanById(maNd: number): Observable<NguoiDung> {
    return this.http.get<NguoiDung>(`${this.apiUrl}/${maNd}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết: ', error);
        return throwError(() => new Error('Không thể tải chi tiết người dân'));
      })
    );
  }
  updateNguoiDan(maNd: number, nguoidan: any): Observable<any> {
    return this.http.put(
      `https://localhost:7025/api/NguoiDans/${maNd}`,
      nguoidan
    );
  }
  deleteNguoiDan(maNd: number): Observable<any> {
    return this.http.delete(`https://localhost:7025/api/NguoiDans/${maNd}`);
  }
}
