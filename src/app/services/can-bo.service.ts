import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CanBoYte } from '../model/model-chung.model';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class CanBoYteService {
  private apiUrl = 'https://localhost:7025/api/CanBoYtes'; //

  constructor(private http: HttpClient) {}

  getDanhSachCanBo(): Observable<CanBoYte[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.$values || []),
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(() => new Error('Không thể tải danh sách cán bộ.'));
      })
    );
  }

  addCanBo(canBo: CanBoYte): Observable<CanBoYte> {
    return this.http.post<CanBoYte>(`${this.apiUrl}`, canBo).pipe(
      catchError((err) => {
        console.error('Lỗi khi thêm cán bộ:', err);
        return throwError(() => new Error('Không thể thêm cán bộ.'));
      })
    );
  }

  getCanBoById(maCb: number): Observable<CanBoYte> {
    return this.http.get<CanBoYte>(`${this.apiUrl}/${maCb}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết:', error);
        return throwError(() => new Error('Không thể tải chi tiết cán bộ.'));
      })
    );
  }
  updateCanBo(maCb: number, canBo: CanBoYte): Observable<CanBoYte> {
    // Đảm bảo luôn có trường lichTiems
    if (!canBo.lichTiems) {
      canBo.lichTiems = [];
    }

    return this.http.put<CanBoYte>(`${this.apiUrl}/${maCb}`, canBo).pipe(
      catchError((error) => {
        console.error('Lỗi khi cập nhật cán bộ:', error);
        return throwError(() => new Error('Không thể cập nhật cán bộ.'));
      })
    );
  }

  deleteCanBo(maCb: number): Observable<any> {
    return this.http.delete(`https://localhost:7025/api/CanBoYtes/${maCb}`);
  }
}
