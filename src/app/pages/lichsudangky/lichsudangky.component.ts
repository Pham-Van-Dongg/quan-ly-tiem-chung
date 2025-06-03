import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LichTiemService } from '../../services/lich-tiem.service';
import { VacxinService } from '../../services/vacxin.service';
import {
  LichTiem,
  Vaccine,
  DotTiem,
  CanBoYte,
  NguoiDung,
  DateObject,
} from '../../model/model-chung.model';
import { LichSuDangKyFilterPipe } from './lichsudangky-filter.pipe';
import { forkJoin } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-lichsudangky',
  standalone: true,
  imports: [
    CommonModule,
    LichSuDangKyFilterPipe,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './lichsudangky.component.html',
  styleUrl: './lichsudangky.component.css',
})
export class LichsudangkyComponent implements OnInit {
  danhSachLichTiemCuaToi: LichTiem[] = [];
  vaccines: Vaccine[] = [];
  errorMessage: string = '';
  page: number = 1;
  tuKhoaTimKiem: string = '';

  constructor(
    private lichTiemService: LichTiemService,
    private vacxinService: VacxinService
  ) {}

  ngOnInit(): void {
    forkJoin({
      lichTiems: this.lichTiemService.getDanhSachLichTiemNguoiDung(),
      vaccines: this.vacxinService.getDanhSachVaccine(),
    }).subscribe({
      next: ({ lichTiems, vaccines }) => {
        this.vaccines = vaccines;
        this.danhSachLichTiemCuaToi = lichTiems.map((lt: LichTiem) => ({
          ...lt,
          maVacNavigation:
            vaccines.find((v) => v.maVac === Number(lt.maVac)) || null,
        }));
      },
      error: (err) => {
        this.errorMessage = err.message || 'Có lỗi xảy ra khi tải dữ liệu!';
      },
    });
  }

  getTrangThai(ngayTiem: string): string {
    const today = new Date();
    const dateTiem = new Date(ngayTiem);

    // So sánh chỉ theo ngày tháng năm, bỏ qua giờ phút giây
    const todayString = today.toISOString().split('T')[0];
    const dateTiemString = dateTiem.toISOString().split('T')[0];

    if (dateTiemString > todayString) return 'Chưa tiêm';
    if (dateTiemString === todayString) return 'Đang diễn ra';
    return 'Đã tiêm';
  }
}
