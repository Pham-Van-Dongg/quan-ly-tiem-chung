declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NguoiDung, DateObject } from '../../model/model-chung.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { NguoidanService } from '../../services/nguoidan.service';
import { NguoiDanFilterPipe } from './nguoi-dan-filter.pipe';

@Component({
  selector: 'app-nguoidan',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NguoiDanFilterPipe,
  ],
  templateUrl: './nguoidan.component.html',
  styleUrl: './nguoidan.component.css',
})
export class NguoidanComponent {
  danhSachNguoiDan: NguoiDung[] = [];
  error: string = '';
  page: number = 1;
  tuKhoaTimKiem: string = '';
  constructor(private NguoidanService: NguoidanService) {}

  ngOnInit(): void {
    this.NguoidanService.getDanhSachNguoiDan().subscribe({
      next: (data) => (this.danhSachNguoiDan = data),
      error: (err) => (this.error = err.message),
    });
  }
  xoaNguoiDan(maNd: number) {
    if (confirm('Bạn có chắc chăn muốn xóa vắc xin này không?')) {
      this.NguoidanService.deleteNguoiDan(maNd).subscribe({
        next: () => {
          this.danhSachNguoiDan = this.danhSachNguoiDan.filter(
            (nd) => nd.maNd !== maNd
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
}
