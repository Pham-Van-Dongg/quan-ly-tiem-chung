import { Component, OnInit } from '@angular/core';
import { DotTiemService } from '../../services/dot-tiem.service'; // đường dẫn đúng với project bạn
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dottiem',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './dottiem.component.html',
  styleUrl: './dottiem.component.css',
})
export class DottiemComponent implements OnInit {
  danhSachDotTiem: any[] = [];
  formDot: any = {};
  dangSua = false;

  constructor(private dotTiemService: DotTiemService) {}

  ngOnInit(): void {
    this.layDanhSachDotTiem();
  }

  layDanhSachDotTiem() {
    this.dotTiemService.layTatCa().subscribe((data) => {
      this.danhSachDotTiem = data;
    });
  }

  moFormThem() {
    this.formDot = {
      tenDot: '',
      ngayBatDau: '',
      ngayKetThuc: '',
      khuVuc: '',
      trangThai: 'Sắp diễn ra',
    };
    this.dangSua = false;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalDotTiem')
    );
    modal.show();
  }

  suaDot(dot: any) {
    this.formDot = { ...dot };
    this.dangSua = true;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalDotTiem')
    );
    modal.show();
  }

  luuDotTiem() {
    if (this.dangSua) {
      this.dotTiemService.sua(this.formDot).subscribe(() => {
        this.layDanhSachDotTiem();
      });
    } else {
      this.dotTiemService.them(this.formDot).subscribe(() => {
        this.layDanhSachDotTiem();
      });
    }

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalDotTiem')
    );
    modal.hide();
  }

  xoaDot(dot: any) {
    if (confirm('Bạn có chắc muốn xóa đợt tiêm này?')) {
      this.dotTiemService.xoa(dot.maDot).subscribe(() => {
        this.layDanhSachDotTiem();
      });
    }
  }
}
