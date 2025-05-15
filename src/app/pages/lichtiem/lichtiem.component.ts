declare var bootstrap: any;
import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lichtiem',
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichtiemComponent {
  danhSachLich: any[] = [
    {
      id: 1,
      ngayTiem: new Date('2025-06-01'),
      tenVaccine: 'Vắc xin 5 trong 1',
      diaDiem: 'Trạm Y tế phường 3',
      soTreDangKy: 12,
      ghiChu: 'Ưu tiên trẻ dưới 12 tháng',
    },
    {
      id: 2,
      ngayTiem: new Date('2025-06-10'),
      tenVaccine: 'Vắc xin sởi - quai bị - rubella',
      diaDiem: 'Trung tâm y tế quận 5',
      soTreDangKy: 20,
      ghiChu: '',
    },
  ];

  popupMo: boolean = false;
  lichDangSua: any = this.khoiTaoLich();

  moPopupThem() {
    this.lichDangSua = this.khoiTaoLich();
    this.popupMo = true;
  }

  suaLich(lich: any) {
    this.lichDangSua = { ...lich }; // clone lại tránh thay đổi gốc
    this.popupMo = true;
  }

  xoaLich(lich: any) {
    if (confirm(`Bạn có chắc muốn xoá lịch tiêm ngày ${lich.ngayTiem}?`)) {
      this.danhSachLich = this.danhSachLich.filter((l) => l.id !== lich.id);
    }
  }

  luuLich() {
    if (this.lichDangSua.id === 0) {
      this.lichDangSua.id = this.danhSachLich.length + 1;
      this.danhSachLich.push(this.lichDangSua);
    } else {
      const index = this.danhSachLich.findIndex(
        (l) => l.id === this.lichDangSua.id
      );
      if (index !== -1) this.danhSachLich[index] = this.lichDangSua;
    }
    this.popupMo = false;
  }

  khoiTaoLich() {
    return {
      id: 0,
      ngayTiem: '',
      tenVaccine: '',
      diaDiem: '',
      soTreDangKy: 0,
      ghiChu: '',
    };
  }
}
