declare var bootstrap: any;

import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-danhsachbe',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],

  templateUrl: './danhsachbe.component.html',
  styleUrl: './danhsachbe.component.css',
})
export class DanhsachbeComponent implements OnInit {
  children: any[] = [];

  child = {
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    cmnd_cccd: '',
    diaChi: '',
    soDienThoai: '',
  };

  apiStatus: 'loading' | 'success' | 'empty' | 'error' = 'loading';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.taiDanhSachBe();
  }
  loiTaiDuLieu = false;
  dangTai = false;

  taiDanhSachBe() {
    this.dangTai = true;
    this.loiTaiDuLieu = false;

    this.http.get<any[]>('https://your-api-url/api/tre').subscribe({
      next: (data) => {
        this.children = data;
        this.dangTai = false;
      },
      error: (err) => {
        console.error('Không kết nối được API:', err);
        this.loiTaiDuLieu = true;
        this.dangTai = false;
      },
    });
  }

  submitChild() {
    this.children.push({ ...this.child });

    this.child = {
      hoTen: '',
      ngaySinh: '',
      gioiTinh: '',
      cmnd_cccd: '',
      diaChi: '',
      soDienThoai: '',
    };

    const modalElement = document.getElementById('themTreModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  taiLai() {
    this.taiDanhSachBe();
  }
}
