declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { DotTiemService } from '../../services/dot-tiem.service'; // đường dẫn đúng với project bạn
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotTiem, DateObject } from '../../model/model-chung.model';
import { HttpClientModule } from '@angular/common/http';
import { DotTiemFilterPipe } from './dot-tiem-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-dottiem',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    DotTiemFilterPipe,
    NgxPaginationModule,
  ],
  templateUrl: './dottiem.component.html',
  styleUrl: './dottiem.component.css',
})
export class DotTiemComponent {
  danhSachDotTiem: DotTiem[] = [];
  error: string = '';
  page: number = 1;

  constructor(private DotTiemService: DotTiemService) {}

  ngOnInit(): void {
    this.DotTiemService.getDanhSachDotTiem().subscribe({
      next: (data) => (this.danhSachDotTiem = data),
      error: (err) => (this.error = err.message),
    });
  }
  newDotTiem: DotTiem = {
    maDot: null,
    ngayBatDau: '',
    ngayKetThuc: '',
    diaDiem: '',
    lichTiems: [],
  };
  themDotTiem(): void {
    this.DotTiemService.addDotTiem(this.newDotTiem).subscribe({
      next: (data) => {
        this.danhSachDotTiem.push(data);
        this.newDotTiem = {
          maDot: null,
          ngayBatDau: '',
          ngayKetThuc: '',
          diaDiem: '',
          lichTiems: [],
        };
        // Đóng modal bằng Bootstrap JS
        const modalElement = document.getElementById('themDotTiemModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        alert('Thêm đợt tiêm thành công!');
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi thêm đợt tiêm.');
      },
    });
  }

  selectedDotTiem: DotTiem | null = null;

  xemChiTiet(maDot: number): void {
    this.DotTiemService.getDotTiemId(maDot).subscribe({
      next: (data) => {
        this.selectedDotTiem = data;
        const modal = new bootstrap.Modal(
          document.getElementById('chiTietModal')
        );
        modal.show();
      },
      error: (err) => {
        console.error(err);
        alert('Không thể tải chi tiết đợt tiêm');
      },
    });
  }
  dottiemDangSua: any = {};
  batDauSua(dotTiem: any) {
    this.dottiemDangSua = { ...dotTiem };
  }
  luuChinhSua() {
    this.capNhatDotTiem(this.dottiemDangSua);
  }
  capNhatDotTiem(dottiemDaSua: any) {
    const index = this.danhSachDotTiem.findIndex(
      (dt) => dt.maDot === dottiemDaSua.maDot
    );
    if (index !== -1) {
      this.danhSachDotTiem[index] = { ...dottiemDaSua };
    }
  }
  xoaDotTiem(maDot: number) {
    if (confirm('Bạn có chắc muốn xóa đợt tiêm này không?')) {
      this.DotTiemService.deleteDotTiem(maDot).subscribe({
        next: () => {
          this.danhSachDotTiem = this.danhSachDotTiem.filter(
            (md) => md.maDot !== maDot
          );
          alert('Xóa thành công');
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          alert('Xóa thất bại');
        },
      });
    }
  }
  tuKhoaTimKiem: string = '';
}
