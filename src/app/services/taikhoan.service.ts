import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, Observable, throwError } from 'rxjs';
import { TaiKhoan } from '../model/model-chung.model';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class TaikhoanService {
  private apiUrl = 'https://localhost:7025/api/TaiKhoans';
  constructor(private http: HttpClient) {}

  getDanhSachTaiKhoan(): Observable<TaiKhoan[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.$values || []),
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(
          () => new Error('Không thể tải danh sách tài khoản.')
        );
      })
    );
  }

  getTaiKhoanById(maTk: number): Observable<any> {
    return this.http.get<TaiKhoan>(`${this.apiUrl}/${maTk}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết: ', error);
        return throwError(() => new Error('Không thể tải chi tiết tài khoản'));
      })
    );
  }
}
