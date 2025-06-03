import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, Observable, throwError } from 'rxjs';
import { NguoiDung } from '../model/model-chung.model';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class NguoidanService {
  private apiUrl = 'https://localhost:7025/api/NguoiDans';
  constructor(private http: HttpClient) {}

  getDanhSachNguoiDan(): Observable<NguoiDung[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      // Lấy danh sách từ $values
      // Nếu backend trả về JSON có thuộc tính $values
      // thì chúng ta chỉ lấy phần đó
      // Ngược lại, có thể cần xử lý fallback
      // Dùng optional chaining để tránh lỗi null
      // hoặc bạn có thể kiểm tra rõ ràng hơn nếu muốn
      // tránh lỗi runtime nếu dữ liệu không khớp
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(
          () => new Error('Không thể tải danh sách người dân.')
        );
      }),
      // Map dữ liệu về đúng kiểu NguoiDung[]
      // và truy xuất vào $values
      map((res) => res?.$values ?? [])
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

  updateNguoiDan(id: number, data: NguoiDung): Observable<NguoiDung> {
    return this.http
      .put<NguoiDung>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }
  deleteNguoiDan(maNd: number): Observable<any> {
    return this.http.delete(`https://localhost:7025/api/NguoiDans/${maNd}`);
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Lỗi server (${error.status})`;
    }
    console.error('Lỗi:', error);
    return throwError(() => new Error(errorMessage));
  }
}
