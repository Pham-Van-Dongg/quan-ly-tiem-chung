import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaiKhoan } from '../model/model-chung.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'https://localhost:7025/api/TaiKhoans/dangky';
  constructor(private http: HttpClient) {}
  register(data: TaiKhoan): Observable<TaiKhoan> {
    return this.http.post<TaiKhoan>(this.apiUrl, data).pipe(
      tap((response: TaiKhoan) => {
        this.saveSession(response);
        console.log('Đăng ký thành công:', response);
      }),
      catchError(this.handleError)
    );
  }

  private saveSession(taiKhoan: TaiKhoan): void {
    localStorage.setItem('currentUser', JSON.stringify(taiKhoan));
    localStorage.setItem('username', taiKhoan.tenDangNhap);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
  }

  getCurrentUser(): TaiKhoan | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? (JSON.parse(userData) as TaiKhoan) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Lỗi phía client:', error.error.message);
    } else {
      console.error(`Lỗi từ server (${error.status}):`, error.error);
    }

    return throwError(() => ({
      status: error.status,
      message:
        error.error?.message ||
        'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.',
    }));
  }
}
