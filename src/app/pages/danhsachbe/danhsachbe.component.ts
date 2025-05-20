declare var bootstrap: any;

import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-danhsachbe',
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './danhsachbe.component.html',
  styleUrl: './danhsachbe.component.css',
})
export class DanhsachbeComponent {
  children: any[] = [];

  child = {
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    cmnd_cccd: '',
    diaChi: '',
    soDienThoai: '', // ➕ Thêm dòng này để lưu SĐT
  };

  submitChild() {
    // Thêm bản sao của đối tượng child vào danh sách
    this.children.push({ ...this.child });

    console.log('Trẻ được thêm:', this.child);

    // Reset form sau khi thêm
    this.child = {
      hoTen: '',
      ngaySinh: '',
      gioiTinh: '',
      cmnd_cccd: '',
      diaChi: '',
      soDienThoai: '', // reset luôn SĐT
    };

    // Đóng modal
    const modalElement = document.getElementById('themTreModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
}
