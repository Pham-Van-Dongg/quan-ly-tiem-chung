import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaiKhoan } from '../model/model-chung.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7025/api/TaiKhoans/dangnhap';

  constructor(private http: HttpClient) {}

  login(credentials: {
    tenDangNhap: string;
    matKhau: string;
  }): Observable<TaiKhoan> {
    return this.http.post<TaiKhoan>(this.apiUrl, credentials);
  }

  saveToLocalStorage(data: TaiKhoan): void {
    if (data && data.tenDangNhap) {
      localStorage.setItem('currentUser', JSON.stringify(data)); // sửa key thành currentUser
    } else {
      console.warn('Không lưu được dữ liệu login vào localStorage:', data);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // sửa key thành currentUser
  }

  getUserFromLocalStorage(): TaiKhoan | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
}
