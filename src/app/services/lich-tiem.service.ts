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
      month: date.getMonth() + 1, // getMonth() trả về 0-11, nên +1
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
        lichTiems.map((lt) => ({
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
    return this.http.post<LichTiem>(this.apiUrl, payload).pipe(
      map((lt) => ({
        ...lt,
        ngayTiem: this.toDateObject(lt.ngayTiem as any), // API trả về chuỗi
      })),
      catchError((err) => {
        console.error('Lỗi khi thêm lịch tiêm:', err);
        return throwError(() => new Error('Không thể thêm lịch tiêm.'));
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
      ...lichTiem,
      ngayTiem: this.toDateString(lichTiem.ngayTiem),
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
}
