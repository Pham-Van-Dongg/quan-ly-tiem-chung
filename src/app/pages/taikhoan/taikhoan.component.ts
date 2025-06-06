import { Component, OnInit } from '@angular/core';
import { TaikhoanService } from '../../services/taikhoan.service';
import { TaiKhoan } from '../../model/model-chung.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TaiKhoanFilterPipe } from './tai-khoanfilter.pipe';
import { NguoidanService } from '../../services/nguoidan.service';

@Component({
  selector: 'app-taikhoan',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, TaiKhoanFilterPipe],
  templateUrl: './taikhoan.component.html',
  styleUrl: './taikhoan.component.css',
})
export class TaikhoanComponent implements OnInit {
  danhSachTaiKhoan: TaiKhoan[] = [];
  tuKhoaTimKiem: string = '';
  error: string = '';
  page: number = 1;

  constructor(
    private taiKhoanService: TaikhoanService,
    private nguoiDanService: NguoidanService
  ) {}

  ngOnInit(): void {
    this.layDanhSachTaiKhoan();
  }

  layDanhSachTaiKhoan(): void {
    this.taiKhoanService.getDanhSachTaiKhoan().subscribe({
      next: (data) => {
        this.danhSachTaiKhoan = data;

        this.danhSachTaiKhoan.forEach((tk) => {
          if (tk.maNd != null) {
            this.nguoiDanService.getNguoiDanById(tk.maNd).subscribe({
              next: (nguoiDan) => {
                tk.maNdNavigation = nguoiDan;
              },
              error: () => {
                console.warn(`Không tìm thấy người dân với mã ${tk.maNd}`);
              },
            });
          }
        });
      },
      error: (err) => {
        this.error = err.message || 'Đã xảy ra lỗi khi tải danh sách tài khoản';
      },
    });
  }
}
