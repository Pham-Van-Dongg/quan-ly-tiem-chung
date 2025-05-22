import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LichTiemService {
  private apiUrl = 'http://localhost:7025/api/LichTiems';

  constructor(private http: HttpClient) {}

  // Lấy danh sách lịch tiêm
  getDanhSach(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/LichTiems`);
  }
  layTatCa(): Observable<any[]> {
    return this.http.get<any[]>(`/api/LichTiems`);
  }

  // Lấy danh sách vaccine
  getDanhSachVac(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Vaccines`);
  }

  // Lấy danh sách đợt tiêm
  getDanhSachDotTiem(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/DotTiems`);
  }

  // Lấy danh sách cán bộ y tế
  getDanhSachCanBo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/CanBoYTes`);
  }

  // Thêm lịch tiêm
  themLich(lichMoi: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/LichTiems`, lichMoi);
  }

  // Sửa lịch tiêm
  suaLich(id: number, lichCapNhat: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/LichTiems/${id}`, lichCapNhat);
  }

  // Xóa lịch tiêm
  xoaLich(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/LichTiems/${id}`);
  }
}
