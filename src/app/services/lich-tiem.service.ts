import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LichTiemService {
  private apiUrl = 'http://localhost:7025/api/LichTiems';

  constructor(private http: HttpClient) {}

  layTatCa(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  them(lich: any): Observable<any> {
    return this.http.post(this.apiUrl, lich);
  }

  sua(lich: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${lich.maLichTiem}`, lich);
  }

  xoa(maLichTiem: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${maLichTiem}`);
  }
}
