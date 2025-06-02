import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaiKhoan, NguoiDung } from '../model/model-chung.model';
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
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          taiKhoan: {
            maTk: data.maTk,
            tenDangNhap: data.tenDangNhap,
            loaiTaiKhoan: data.loaiTaiKhoan,
            maNd: data.maNd,
          },
          nguoiDung: data.maNdNavigation || null, // ✅ lưu null nếu không có
        })
      );
    } else {
      console.warn('Không lưu được tài khoản:', data);
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // sửa key thành currentUser
  }

  getUserFromLocalStorage(): {
    taiKhoan: {
      maTk: number;
      tenDangNhap: string;
      loaiTaiKhoan: number;
      maNd: number | null;
    };
    nguoiDung: NguoiDung;
  } | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }
}
