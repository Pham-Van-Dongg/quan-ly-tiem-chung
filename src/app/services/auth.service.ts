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
    return this.http.post<TaiKhoan>(this.apiUrl, credentials).pipe(
      tap((res) => this.saveToLocalStorage(res)),
      catchError(this.handleError)
    );
  }

  saveToLocalStorage(data: TaiKhoan): void {
    if (data && data.tenDangNhap) {
      // Loại bỏ tham chiếu vòng
      const sanitizedData = this.sanitizeData(data);

      const currentUser = {
        taiKhoan: {
          maTk: sanitizedData.maTk,
          tenDangNhap: sanitizedData.tenDangNhap,
          matKhau: sanitizedData.matKhau || '', // Đảm bảo có matKhau, nếu API không trả về thì để rỗng
          loaiTaiKhoan: sanitizedData.loaiTaiKhoan,
          maNd: sanitizedData.maNd,
        },
        nguoiDung: sanitizedData.maNdNavigation || null,
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('username', sanitizedData.tenDangNhap);
      console.log('Dữ liệu lưu vào localStorage sau đăng nhập:', currentUser);
    } else {
      console.warn('Không lưu được tài khoản:', data);
    }
  }

  // Hàm loại bỏ tham chiếu vòng
  private sanitizeData(data: any): any {
    const seen = new WeakSet();
    const replacer = (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined; // Loại bỏ tham chiếu vòng
        }
        seen.add(value);

        // Loại bỏ các trường tham chiếu
        if (
          key === 'maNdNavigation' ||
          key === 'maCbNavigation' ||
          key === 'maDotNavigation' ||
          key === 'maVacNavigation'
        ) {
          return {
            maNd: value?.maNd || null,
            hoTen: value?.hoTen || null,
            ngaySinh: value?.ngaySinh || null,
            gioiTinh: value?.gioiTinh || null,
            cmndCccd: value?.cmndCccd || null,
            diaChi: value?.diaChi || null,
            soDienThoai: value?.soDienThoai || null,
          };
        }
      }
      return value;
    };

    return JSON.parse(JSON.stringify(data, replacer));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
    localStorage.removeItem('userData');
  }

  getUserFromLocalStorage(): {
    taiKhoan: TaiKhoan;
    nguoiDung: NguoiDung | null;
  } | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã xảy ra lỗi không xác định.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Lỗi server (${error.status})`;
    }
    console.error('Lỗi đăng nhập:', error);
    return throwError(() => new Error(errorMessage));
  }
}
