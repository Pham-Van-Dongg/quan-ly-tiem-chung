import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';
import { LichTiem, DateObject } from '../model/model-chung.model';

@Injectable({ providedIn: 'root' })
export class LichTiemService {
  private apiUrl = 'https://localhost:7025/api/LichTiems';

  constructor(private http: HttpClient) {}

  // Hàm chuyển chuỗi ngày thành DateObject
  private toDateObject(dateString: string): DateObject {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // getMonth() trả về 0-11, -> +1
      day: date.getDate(),
    };
  }

  // Hàm chuyển DateObject thành chuỗi yyyy-mm-dd
  private toDateString(dateObj: DateObject): string {
    return `${dateObj.year}-${dateObj.month
      .toString()
      .padStart(2, '0')}-${dateObj.day.toString().padStart(2, '0')}`;
  }

  getDanhSachLichTiem(): Observable<LichTiem[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.$values || []), // lấy mảng từ $values
      map((lichTiems: any[]) =>
        lichTiems
          // Chỉ lấy những lịch tiêm không có người dùng (maNd === null)
          .filter((lt) => lt.maNd === null)
          // Chuyển định dạng ngày
          .map((lt) => ({
            ...lt,
            ngayTiem:
              typeof lt.ngayTiem === 'string'
                ? this.toDateObject(lt.ngayTiem)
                : lt.ngayTiem,
          }))
      ),
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(
          () => new Error('Không thể tải danh sách lịch tiêm.')
        );
      })
    );
  }

  addLichTiem(lichTiem: LichTiem): Observable<LichTiem> {
    // Chuyển ngayTiem thành chuỗi trước khi gửi
    const payload = {
      ...lichTiem,
      ngayTiem: this.toDateString(lichTiem.ngayTiem),
    };

    return this.http
      .post<LichTiem>(
        'https://localhost:7025/api/LichTiems/postchostaff',
        payload
      )
      .pipe(
        map((lt) => ({
          ...lt,
          ngayTiem: this.toDateObject(lt.ngayTiem as any),
        })),
        catchError((err) => {
          console.error('Lỗi khi thêm lịch tiêm (không người dùng):', err);
          return throwError(
            () => new Error('Không thể thêm lịch tiêm (không người dùng).')
          );
        })
      );
  }

  getLichTiemById(maLichTiem: number): Observable<LichTiem> {
    return this.http.get<LichTiem>(`${this.apiUrl}/${maLichTiem}`).pipe(
      map((lt) => ({
        ...lt,
        ngayTiem:
          typeof lt.ngayTiem === 'string'
            ? this.toDateObject(lt.ngayTiem)
            : lt.ngayTiem,
      })),
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết: ', error);
        return throwError(() => new Error('Không thể tải chi tiết lịch tiêm.'));
      })
    );
  }

  updateLichTiem(maLichTiem: number, lichTiem: LichTiem): Observable<LichTiem> {
    const payload = {
      maLichTiem: lichTiem.maLichTiem,
      maVac: lichTiem.maVac,
      maDot: lichTiem.maDot,
      maCb: lichTiem.maCb,
      ngayTiem: lichTiem.ngayTiem,
      muiThu: lichTiem.muiThu,
      trangThai: lichTiem.trangThai,
    };

    return this.http
      .put<LichTiem>(`${this.apiUrl}/${maLichTiem}`, payload)
      .pipe(
        map((lt) => ({
          ...lt,
          ngayTiem: this.toDateObject(lt.ngayTiem as any),
        })),
        catchError((err) => {
          console.error('Lỗi khi cập nhật lịch tiêm:', err);
          return throwError(() => new Error('Không thể cập nhật lịch tiêm.'));
        })
      );
  }

  deleteLichTiem(maLichTiem: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${maLichTiem}`).pipe(
      catchError((err) => {
        console.error('Lỗi khi xóa lịch tiêm:', err);
        return throwError(() => new Error('Không thể xóa lịch tiêm.'));
      })
    );
  }
  dangKyLichTiemNguoiDung(lichTiem: LichTiem): Observable<LichTiem> {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const maNd = currentUser?.taiKhoan?.maNd;

    if (!maNd) {
      return throwError(
        () => new Error('Không tìm thấy người dùng trong localStorage.')
      );
    }

    // Tạo payload từ dữ liệu của lichTiem
    const payload = {
      maCb: lichTiem.maCb, // Lấy từ lichTiem
      maDot: lichTiem.maDot, // Lấy từ lichTiem
      maNd: maNd, // Sử dụng mã người dùng từ localStorage
      maVac: lichTiem.maVac, // Lấy từ lichTiem
      muiThu: lichTiem.muiThu, // Lấy từ lichTiem
      ngayTiem: this.toDateString(lichTiem.ngayTiem), // Chuyển DateObject thành chuỗi
      trangThai: lichTiem.trangThai || 'Chưa tiêm', // Mặc định là 'Chưa tiêm' nếu không có trạng thái
    };
    console.log('Payload gửi lên:', payload);

    return this.http.post<LichTiem>(this.apiUrl, payload).pipe(
      map((lt) => ({
        ...lt,
        ngayTiem: this.toDateObject(lt.ngayTiem as any),
      })),
      catchError((err) => {
        console.error('Lỗi khi đăng ký lịch tiêm người dùng:', err);
        return throwError(() => new Error('Không thể đăng ký lịch tiêm.'));
      })
    );
  }
  huyDangKyLichTiem(lichTiem: LichTiem, maNd: number): Observable<void> {
    console.log('maNd nhận từ component:', maNd);
    if (!maNd || isNaN(maNd)) {
      console.error('Mã người dùng không hợp lệ:', maNd);
      return throwError(() => new Error('Mã người dùng không hợp lệ.'));
    }

    if (!lichTiem || !lichTiem.ngayTiem) {
      console.error('lichTiem hoặc ngayTiem không hợp lệ:', lichTiem);
      return throwError(() => new Error('Dữ liệu lịch tiêm không hợp lệ.'));
    }

    // Tạo payload chỉ với các trường cần thiết
    const payload = {
      maNd: maNd,
      maVac: lichTiem.maVac,
      maDot: lichTiem.maDot,
      maCb: lichTiem.maCb,
      ngayTiem: this.toDateString(lichTiem.ngayTiem),
      muiThu: lichTiem.muiThu,
    };

    console.log('Payload gửi lên API hủy đăng ký:', payload);

    return this.http.post<void>(`${this.apiUrl}/huydangky`, payload).pipe(
      catchError((err) => {
        console.error('Lỗi khi hủy đăng ký:', err);
        return throwError(() => new Error('Không thể hủy đăng ký lịch tiêm.'));
      })
    );
  }

  getDanhSachLichTiemNguoiDung(): Observable<LichTiem[]> {
    // Lấy mã người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const maNd = currentUser?.taiKhoan?.maNd;

    if (!maNd) {
      return throwError(
        () => new Error('Không tìm thấy người dùng trong localStorage.')
      );
    }

    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res.$values || []), // Lấy danh sách từ $values
      map((lichTiems: any[]) =>
        lichTiems
          .filter((lt) => lt.maNd === maNd) // Chỉ lấy lịch tiêm có đúng maNd
          .map((lt) => ({
            ...lt,
            ngayTiem:
              typeof lt.ngayTiem === 'string'
                ? this.toDateObject(lt.ngayTiem)
                : lt.ngayTiem,
          }))
      ),
      catchError((err) => {
        console.error('Lỗi khi tải danh sách lịch tiêm của người dùng:', err);
        return throwError(
          () => new Error('Không thể tải danh sách lịch tiêm của người dùng.')
        );
      })
    );
  }
}
