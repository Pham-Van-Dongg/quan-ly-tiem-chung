import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NguoiDung } from '../model/model-chung.model'; // ✨ Sửa từ TaiKhoan sang NguoiDung

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'https://localhost:7025/api/NguoiDans';

  constructor(private http: HttpClient) {}

  register(data: NguoiDung): Observable<NguoiDung> {
    return this.http.post<NguoiDung>(this.apiUrl, data).pipe(
      tap((response: NguoiDung) => {
        console.log('Đăng ký thành công:', response);
        // Lưu thông tin tài khoản (TaiKhoan) vào localStorage
        if (response.taiKhoans && response.taiKhoans.length > 0) {
          localStorage.setItem(
            'currentUser',
            JSON.stringify(response.taiKhoans[0])
          );
          localStorage.setItem('username', response.taiKhoans[0].tenDangNhap);
        }
        // Lưu toàn bộ thông tin người dùng (NguoiDung) vào localStorage
        localStorage.setItem('userData', JSON.stringify(response));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    localStorage.removeItem('userData'); // Xóa userData khi đăng xuất
  }

  getCurrentUser(): any | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  getUserData(): NguoiDung | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi phía server
      errorMessage = error.error?.message || `Lỗi server (${error.status})`;
      if (error.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ hoặc tên đăng nhập đã tồn tại.';
      } else if (error.status === 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau.';
      }
    }
    console.error('Lỗi đăng ký:', error);
    return throwError(() => new Error(errorMessage));
  }
}
