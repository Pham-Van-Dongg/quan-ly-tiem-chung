import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LichTiem,
  Vaccine,
  DotTiem,
  NguoiDung,
} from '../model/model-chung.model';
@Injectable({ providedIn: 'root' })
export class LichTiemService {
  private apiUrl = 'http://localhost:7025/api/LichTiems';

  constructor(private http: HttpClient) {}

  getAllLichTiem(): Observable<LichTiem[]> {
    return this.http.get<LichTiem[]>(`${this.apiUrl}/LichTiems`);
  }

  getLichTiemById(id: number): Observable<LichTiem> {
    return this.http.get<LichTiem>(`${this.apiUrl}/LichTiems/${id}`);
  }

  createLichTiem(lichTiem: Partial<LichTiem>): Observable<LichTiem> {
    return this.http.post<LichTiem>(`${this.apiUrl}/LichTiems`, lichTiem);
  }

  updateLichTiem(id: number, lichTiem: Partial<LichTiem>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/LichTiems/${id}`, lichTiem);
  }

  deleteLichTiem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/LichTiems/${id}`);
  }

  getDanhSachVac(): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(`${this.apiUrl}/Vaccines`);
  }

  getDanhSachDotTiem(): Observable<DotTiem[]> {
    return this.http.get<DotTiem[]>(`${this.apiUrl}/DotTiems`);
  }

  getDanhSachNguoiDung(): Observable<NguoiDung[]> {
    return this.http.get<NguoiDung[]>(`${this.apiUrl}/NguoiDungs`); // Giả định endpoint
  }
}
