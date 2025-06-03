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
        console.log('Phản hồi từ API khi đăng ký:', response);

        // Loại bỏ tham chiếu vòng và chỉ giữ dữ liệu cần thiết
        const sanitizedResponse = this.sanitizeData(response);

        // Kiểm tra taiKhoans và lưu vào localStorage
        if (
          sanitizedResponse.taiKhoans &&
          sanitizedResponse.taiKhoans.$values?.length > 0
        ) {
          const taiKhoan = sanitizedResponse.taiKhoans.$values[0];
          const currentUser = {
            taiKhoan: {
              maTk: taiKhoan.maTk,
              tenDangNhap: taiKhoan.tenDangNhap,
              loaiTaiKhoan: taiKhoan.loaiTaiKhoan,
              maNd: taiKhoan.maNd,
            },
            nguoiDung: {
              maNd: sanitizedResponse.maNd,
              hoTen: sanitizedResponse.hoTen,
              ngaySinh: sanitizedResponse.ngaySinh,
              gioiTinh: sanitizedResponse.gioiTinh,
              cmndCccd: sanitizedResponse.cmndCccd,
              diaChi: sanitizedResponse.diaChi,
              soDienThoai: sanitizedResponse.soDienThoai,
              lichTiems: sanitizedResponse.lichTiems,
            },
          };
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          localStorage.setItem('username', taiKhoan.tenDangNhap);
          localStorage.setItem('userData', JSON.stringify(sanitizedResponse));
          console.log('Dữ liệu lưu vào localStorage:', {
            currentUser,
            username: taiKhoan.tenDangNhap,
            userData: sanitizedResponse,
          });
        } else {
          console.warn('Không có taiKhoans trong phản hồi:', sanitizedResponse);
          localStorage.setItem('userData', JSON.stringify(sanitizedResponse));
        }
      }),
      catchError(this.handleError)
    );
  }

  // Hàm loại bỏ tham chiếu vòng và chỉ giữ dữ liệu cần thiết
  private sanitizeData(data: any): any {
    const seen = new WeakSet();
    const replacer = (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return undefined; // Loại bỏ tham chiếu vòng
        }
        seen.add(value);

        // Xử lý các trường cụ thể để loại bỏ tham chiếu
        if (
          key === 'maNdNavigation' ||
          key === 'maCbNavigation' ||
          key === 'maDotNavigation' ||
          key === 'maVacNavigation'
        ) {
          return undefined; // Loại bỏ các trường tham chiếu
        }
        if (key === 'lichTiems' || key === 'taiKhoans') {
          if (value && value.$values) {
            return {
              $id: value.$id,
              $values: value.$values.map((item: any) =>
                this.sanitizeData(item)
              ),
            };
          }
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
    let errorMessage =
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại Kindergarten.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
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
