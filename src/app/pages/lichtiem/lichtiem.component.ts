import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { LichTiemFilter } from './lich-tiem-filter.pipe';
import { LichTiemService } from '../../services/lich-tiem.service';
import { VacxinService } from '../../services/vacxin.service';
import { DotTiemService } from '../../services/dot-tiem.service';
import { CanBoYteService } from '../../services/can-bo.service';
import { NguoidanService } from '../../services/nguoidan.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import {
  LichTiem,
  Vaccine,
  DotTiem,
  CanBoYte,
  NguoiDung,
  DateObject,
} from '../../model/model-chung.model';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
interface LichTiemExt extends LichTiem {
  trangThaiDangKy?: boolean;
}
@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LichTiemFilter,
    NgxPaginationModule,
  ],
  templateUrl: './lichtiem.component.html',
  styleUrls: ['./lichtiem.component.css'],
})
export class LichTiemComponent implements OnInit {
  currentMaNd: number = 0;
  nguoiDans: NguoiDung[] = [];
  vaccines: Vaccine[] = [];
  dotTiems: DotTiem[] = [];
  canBoYtes: CanBoYte[] = [];
  danhSachLichTiem: LichTiemExt[] = [];
  error: string = '';
  page: number = 1;
  tuKhoaTimKiem: string = '';
  newLichTiem: LichTiem = {
    maLichTiem: 0,
    maNd: 0,
    maVac: 0,
    maDot: 0,
    maCb: 0,
    ngayTiem: { year: 0, month: 0, day: 0 },
    muiThu: 0,
    trangThai: '',
    maVacNavigation: null,
    maDotNavigation: null,
    maCbNavigation: null,
    maNdNavigation: null,
  };

  constructor(
    private nguoidanService: NguoidanService,
    private lichTiemService: LichTiemService,
    private vacxinService: VacxinService,
    private dotTiemService: DotTiemService,
    private canBoYteService: CanBoYteService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUserFromLocalStorage();
    this.currentMaNd = currentUser?.taiKhoan?.maNd || 0;

    if (!this.currentMaNd) {
      alert('Không tìm thấy mã người dùng. Vui lòng đăng nhập lại.');
      return;
    }
    forkJoin({
      nguoiDans: this.nguoidanService.getDanhSachNguoiDan(),
      vaccines: this.vacxinService.getDanhSachVaccine(),
      dotTiems: this.dotTiemService.getDanhSachDotTiem(),
      canBoYtes: this.canBoYteService.getDanhSachCanBo(),
      lichTiems: this.lichTiemService.getDanhSachLichTiem(),
    }).subscribe({
      next: ({ nguoiDans, vaccines, dotTiems, canBoYtes, lichTiems }) => {
        this.nguoiDans = nguoiDans;
        this.vaccines = vaccines;
        this.dotTiems = dotTiems;
        this.canBoYtes = canBoYtes;
        this.danhSachLichTiem = lichTiems.map((lt: LichTiem) => ({
          ...lt,
          trangThaiDangKy: lt.maNd === this.currentMaNd,
          maVacNavigation: vaccines.find((v) => v.maVac === lt.maVac) || null,
          maDotNavigation: dotTiems.find((d) => d.maDot === lt.maDot) || null,
          maCbNavigation: canBoYtes.find((c) => c.maCb === lt.maCb) || null,
          maNdNavigation: nguoiDans.find((n) => n.maNd === lt.maNd) || null,
        }));
      },
      error: (err) => {
        this.error = 'Lỗi khi tải dữ liệu: ' + err.message;
      },
    });
  }
  currentUserId: number = Number(localStorage.getItem('userId'));

  luuLichTiem() {
    this.lichTiemService.addLichTiem(this.newLichTiem).subscribe({
      next: (newLichTiem) => {
        alert('Tạo lịch tiêm thành công');
        // Cập nhật danh sách
        this.danhSachLichTiem.push({
          ...newLichTiem,
          maVacNavigation:
            this.vaccines.find((v) => v.maVac === newLichTiem.maVac) || null,
          maDotNavigation:
            this.dotTiems.find((d) => d.maDot === newLichTiem.maDot) || null,
          maCbNavigation:
            this.canBoYtes.find((c) => c.maCb === newLichTiem.maCb) || null,
          maNdNavigation:
            this.nguoiDans.find((n) => n.maNd === newLichTiem.maNd) || null,
        });
        // Reset form
        this.newLichTiem = {
          maLichTiem: 0,
          maNd: 0,
          maVac: 0,
          maDot: 0,
          maCb: 0,
          ngayTiem: { year: 0, month: 0, day: 0 },
          muiThu: 0,
          trangThai: '',
          maVacNavigation: null,
          maDotNavigation: null,
          maCbNavigation: null,
          maNdNavigation: null,
        };
        // Đóng modal
        const modalElement = document.getElementById('themLichTiemModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(
            modalElement
          );
          modal.hide();
        }
      },
      error: (err) => {
        alert('Lỗi khi tạo lịch tiêm: ' + err.message);
      },
    });
  }
  onNgayTiemChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const date = new Date(input.value);
    this.newLichTiem.ngayTiem = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  dangKyLichTiem(lichtiem: LichTiemExt) {
    const lichTiemMoi: LichTiem = {
      ...lichtiem,
      maLichTiem: 0, // Đặt về 0 để tạo mới
      maNd: this.currentMaNd, // Gán mã người dùng hiện tại
      trangThai: '', // Trạng thái mặc định (đã tiêm/chưa tiêm)
    };

    this.lichTiemService.dangKyLichTiemNguoiDung(lichTiemMoi).subscribe({
      next: (ltMoi) => {
        alert('✅ Đăng ký lịch tiêm thành công!');
        // Cập nhật lịch tiêm hiện có thay vì thêm mới
        this.danhSachLichTiem = this.danhSachLichTiem.map((lt) =>
          lt.maLichTiem === lichtiem.maLichTiem
            ? {
                ...ltMoi,
                trangThaiDangKy: true, // Cập nhật trạng thái đăng ký
                maNd: this.currentMaNd,
                maVacNavigation:
                  this.vaccines.find((v) => v.maVac === ltMoi.maVac) || null,
                maDotNavigation:
                  this.dotTiems.find((d) => d.maDot === ltMoi.maDot) || null,
                maCbNavigation:
                  this.canBoYtes.find((c) => c.maCb === ltMoi.maCb) || null,
                maNdNavigation:
                  this.nguoiDans.find((n) => n.maNd === ltMoi.maNd) || null,
              }
            : lt
        );
      },
      error: (err) => {
        alert('❌ Lỗi khi đăng ký lịch tiêm: ' + err.message);
      },
    });
  }

  huyDangKyLichTiem(lichTiem: LichTiemExt) {
    console.log('Gọi hủy đăng ký lịch tiêm:', lichTiem);
    this.lichTiemService
      .huyDangKyLichTiem(lichTiem, this.currentMaNd)
      .subscribe({
        next: () => {
          alert('✅ Hủy đăng ký lịch tiêm thành công!');
          this.danhSachLichTiem = this.danhSachLichTiem.map((lt) =>
            lt.maLichTiem === lichTiem.maLichTiem
              ? {
                  ...lt,
                  trangThaiDangKy: false,
                  maNd: 0,
                  maNdNavigation: null,
                }
              : lt
          );
        },
        error: (err) => {
          alert('❌ Lỗi khi hủy đăng ký lịch tiêm: ' + err.message);
        },
      });
  }
}
