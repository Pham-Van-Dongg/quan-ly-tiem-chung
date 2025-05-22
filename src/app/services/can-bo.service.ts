import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CanBoYte } from '../model/model-chung.model';
@Injectable({
  providedIn: 'root',
})
export class CanBoYteService {
  private apiUrl = 'http://localhost:7025/api/CanBoYtes'; //

  constructor(private http: HttpClient) {}

  getCanBoYtes(): Observable<CanBoYte[]> {
    return this.http.get<CanBoYte[]>(this.apiUrl);
  }

  getCanBoById(maCb: number): Observable<CanBoYte> {
    return this.http.get<CanBoYte>(`${this.apiUrl}/${maCb}`);
  }

  addCanBo(canBo: CanBoYte): Observable<CanBoYte> {
    return this.http.post<CanBoYte>(this.apiUrl, {
      ...canBo,
      maCb: 0, // Backend tự sinh maCb
      lichTiems: [], // Gửi mảng rỗng vì form không nhập lịch tiêm
    });
  }

  updateCanBo(maCb: number, canBo: CanBoYte): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${maCb}`, {
      ...canBo,
      maCb, // Đảm bảo gửi đúng maCb
      lichTiems: canBo.lichTiems || [], // Gửi lichTiems nếu có
    });
  }

  deleteCanBo(maCb: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${maCb}`);
  }
}
