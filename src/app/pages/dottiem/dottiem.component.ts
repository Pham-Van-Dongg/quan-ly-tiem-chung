import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dottiem',
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './dottiem.component.html',
  styleUrl: './dottiem.component.css',
})
export class DottiemComponent {
  danhSachDotTiem = [
    {
      id: 1,
      tenDot: 'Đợt tiêm tháng 6 - Quận 1',
      ngayBatDau: '2025-06-01',
      ngayKetThuc: '2025-06-05',
      khuVuc: 'Quận 1',
      trangThai: 'Sắp diễn ra',
    },
    {
      id: 2,
      tenDot: 'Đợt tiêm tháng 5 - Quận 3',
      ngayBatDau: '2025-05-01',
      ngayKetThuc: '2025-05-03',
      khuVuc: 'Quận 3',
      trangThai: 'Đang diễn ra',
    },
  ];

  // Dữ liệu form
  formDot: any = {};
  dangSua: boolean = false;

  // Mở form thêm
  moFormThem() {
    this.formDot = {
      tenDot: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      khuVuc: '',
      trangThai: 'Sắp diễn ra',
    };
    this.dangSua = false;
  }

  // Mở form sửa
  suaDot(dot: any) {
    this.formDot = { ...dot };
    this.dangSua = true;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalDotTiem')
    );
    modal.show();
  }

  // Lưu đợt tiêm
  luuDotTiem() {
    if (this.dangSua) {
      const index = this.danhSachDotTiem.findIndex(
        (d) => d.id === this.formDot.id
      );
      if (index !== -1) {
        this.danhSachDotTiem[index] = { ...this.formDot };
      }
    } else {
      const newId = Math.max(...this.danhSachDotTiem.map((d) => d.id), 0) + 1;
      this.danhSachDotTiem.push({ ...this.formDot, id: newId });
    }

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalDotTiem')
    );
    modal.hide();
  }

  // Xóa đợt tiêm
  xoaDot(dot: any) {
    if (confirm('Bạn có chắc muốn xóa đợt tiêm này?')) {
      this.danhSachDotTiem = this.danhSachDotTiem.filter(
        (d) => d.id !== dot.id
      );
    }
  }
}
