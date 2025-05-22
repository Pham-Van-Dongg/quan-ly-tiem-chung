declare var bootstrap: any;
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LichTiemService } from '../../services/lich-tiem.service';
@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichTiemComponent implements OnInit {
  danhSachLich: any[] = [];
  popupMo = false;
  lichDangSua: any = {};

  constructor(private lichTiemService: LichTiemService) {}

  ngOnInit(): void {
    this.layTatCaLichTiem();
  }

  layTatCaLichTiem() {
    this.lichTiemService.layTatCa().subscribe({
      next: (res) => {
        this.danhSachLich = res;
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách lịch tiêm:', err);
      },
    });
  }

  moPopupThem() {
    this.lichDangSua = {
      ngayTiem: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
      maVacNavigation: {},
      maDotNavigation: {},
      maNdNavigation: {},
      trangThai: 'Sắp diễn ra',
    };
    this.popupMo = true;
  }

  suaLich(lich: any) {
    this.lichDangSua = { ...lich };
    this.popupMo = true;
  }

  luuLich() {
    if (this.lichDangSua.maLichTiem) {
      this.lichTiemService.sua(this.lichDangSua).subscribe(() => {
        this.layTatCaLichTiem();
        this.popupMo = false;
      });
    } else {
      this.lichTiemService.them(this.lichDangSua).subscribe(() => {
        this.layTatCaLichTiem();
        this.popupMo = false;
      });
    }
  }

  xoaLich(lich: any) {
    if (confirm('Bạn có chắc muốn xóa lịch tiêm này?')) {
      this.lichTiemService.xoa(lich.maLichTiem).subscribe(() => {
        this.layTatCaLichTiem();
      });
    }
  }
}
