declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CanBoYteService } from '../../services/can-bo.service';
import { CanBoYte, LichTiem, DateObject } from '../../model/model-chung.model';
import { CanBoFilterPipe } from './can-bo-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-canboyte',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    CanBoFilterPipe,
    NgxPaginationModule,
  ],
  templateUrl: './canboyte.component.html',
  styleUrl: './canboyte.component.css',
})
export class CanboyteComponent {
  danhSachCanBo: CanBoYte[] = [];
  error: string = '';
  page: number = 1;

  constructor(private CanBoYteService: CanBoYteService) {}

  ngOnInit(): void {
    this.CanBoYteService.getDanhSachCanBo().subscribe({
      next: (data) => (this.danhSachCanBo = data),
      error: (err) => (this.error = err.message),
    });
  }
  newCanBo: CanBoYte = {
    maCb: 0,
    hoTen: '',
    soDienThoai: '',
    chucVu: '',
    donViCongTac: '',
    lichTiems: [],
  };
  themCanBo(): void {
    this.CanBoYteService.addCanBo(this.newCanBo).subscribe({
      next: (data) => {
        // Sau khi thêm thành công thì làm mới danh sách và đóng modal
        this.danhSachCanBo.push(data);

        // Reset form
        this.newCanBo = {
          maCb: 0,
          hoTen: '',
          soDienThoai: '',
          chucVu: '',
          donViCongTac: '',
          lichTiems: [],
        };

        // Đóng modal bằng Bootstrap JS
        const modalElement = document.getElementById('themCanBoModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi thêm cán bộ.');
      },
    });
  }
  selectedCanBo: CanBoYte | null = null;

  xemChiTiet(maCb: number): void {
    this.CanBoYteService.getCanBoById(maCb).subscribe({
      next: (data) => {
        this.selectedCanBo = data;
        const modal = new bootstrap.Modal(
          document.getElementById('chiTietModal')
        );
        modal.show();
      },
      error: (err) => {
        console.error(err);
        alert('Không thể tải chi tiết cán bộ.');
      },
    });
  }
  canBoDangSua: any = {};

  batDauSua(canBo: any) {
    this.canBoDangSua = { ...canBo }; // Tạo bản sao để sửa
  }

  luuChinhSua() {
    // Gửi dữ liệu sửa về API hoặc cập nhật danh sách
    this.capNhatCanBo(this.canBoDangSua);
  }

  capNhatCanBo(canBoDaSua: any) {
    const index = this.danhSachCanBo.findIndex(
      (cb) => cb.maCb === canBoDaSua.maCb
    );
    if (index !== -1) {
      this.danhSachCanBo[index] = { ...canBoDaSua };
    }
  }
  xoaCanBo(maCb: number) {
    if (confirm('Bạn có chắc chắn muốn xóa cán bộ này không?')) {
      this.CanBoYteService.deleteCanBo(maCb).subscribe({
        next: () => {
          this.danhSachCanBo = this.danhSachCanBo.filter(
            (cb) => cb.maCb !== maCb
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
