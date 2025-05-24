import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vaccine } from '../model/model-chung.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VacxinService {
  private apiUrl = 'https://localhost:7025/api/Vaccines';
  constructor(private http: HttpClient) {}

  getDanhSachVaccine(): Observable<Vaccine[]> {
    return this.http.get<Vaccine[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API:', error);
        return throwError(() => new Error('Không thể tải danh sách vắc xin.'));
      })
    );
  }
  addVacccine(vaccine: Vaccine): Observable<Vaccine> {
    return this.http.post<Vaccine>(`${this.apiUrl}`, vaccine).pipe(
      catchError((err) => {
        console.error('Lỗi khi thêm vắc xin:', err);
        return throwError(() => new Error('Không thể thêm vắc xin'));
      })
    );
  }
  getVaccineById(maVac: number): Observable<Vaccine> {
    return this.http.get<Vaccine>(`${this.apiUrl}/${maVac}`).pipe(
      catchError((error) => {
        console.error('Lỗi khi gọi API chi tiết:', error);
        return throwError(() => new Error('Không thể tải chi tiết vắc xin'));
      })
    );
  }
  updateVaccine(maVac: number, vaccine: any): Observable<any> {
    return this.http.put(
      `https://localhost:7025/api/Vaccines/${maVac}`,
      vaccine
    );
  }
  deleteVaccine(maVac: number): Observable<any> {
    return this.http.delete(`https://localhost:7025/api/Vaccines/${maVac}`);
  }
}
