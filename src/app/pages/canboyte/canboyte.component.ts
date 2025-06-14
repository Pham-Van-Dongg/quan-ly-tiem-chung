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
export class CanboyteComponent implements OnInit {
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
    if (
      !this.newCanBo.hoTen ||
      !this.newCanBo.soDienThoai ||
      !/^0[0-9]{9}$/.test(this.newCanBo.soDienThoai) ||
      !this.newCanBo.chucVu ||
      !this.newCanBo.donViCongTac
    ) {
      alert('Vui lòng kiểm tra lại các trường nhập.');
      return;
    }

    this.CanBoYteService.addCanBo(this.newCanBo).subscribe({
      next: (data) => {
        this.danhSachCanBo.push(data);
        this.newCanBo = {
          maCb: 0,
          hoTen: '',
          soDienThoai: '',
          chucVu: '',
          donViCongTac: '',
          lichTiems: [],
        };
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
    if (
      !this.canBoDangSua.hoTen ||
      !this.canBoDangSua.soDienThoai ||
      !/^0[0-9]{9}$/.test(this.canBoDangSua.soDienThoai) ||
      !this.canBoDangSua.chucVu ||
      !this.canBoDangSua.donViCongTac
    ) {
      alert('Vui lòng kiểm tra lại thông tin trước khi lưu.');
      return;
    }

    this.capNhatCanBo(this.canBoDangSua);
  }

  capNhatCanBo(canBoDaSua: CanBoYte) {
    this.CanBoYteService.updateCanBo(canBoDaSua.maCb, canBoDaSua).subscribe({
      next: (updated) => {
        const index = this.danhSachCanBo.findIndex(
          (cb) => cb.maCb === updated.maCb
        );
        if (index !== -1) {
          this.danhSachCanBo[index] = updated;
        }

        const modalElement = document.getElementById('suaCanBoModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();

        alert('Cập nhật thành công');
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Cập nhật thất bại');
      },
    });
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
