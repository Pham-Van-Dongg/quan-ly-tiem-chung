import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  loaiTaiKhoan: number = 0;
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
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('currentUser'); // key phải đúng
    if (userString) {
      const user = JSON.parse(userString);
      this.loaiTaiKhoan = Number(user?.taiKhoan?.loaiTaiKhoan); // đảm bảo là kiểu số
      this.currentMaNd = Number(user?.taiKhoan?.maNd);
    }
    // Ví dụ lấy từ localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loaiTaiKhoan = Number(user?.taiKhoan?.loaiTaiKhoan || 0);

    console.log('Loại tài khoản:', this.loaiTaiKhoan, typeof this.loaiTaiKhoan);

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
    const lich = this.newLichTiem;

    // 👉 Kiểm tra các trường bắt buộc
    const isInvalid =
      !lich.maVac ||
      !lich.maDot ||
      !lich.maCb ||
      !lich.trangThai ||
      !lich.muiThu ||
      lich.muiThu <= 0 ||
      !lich.ngayTiem ||
      !lich.ngayTiem.year ||
      lich.ngayTiem.year <= 0 ||
      !lich.ngayTiem.month ||
      lich.ngayTiem.month <= 0 ||
      !lich.ngayTiem.day ||
      lich.ngayTiem.day <= 0;

    if (isInvalid) {
      alert('❌ Vui lòng nhập đầy đủ và hợp lệ các trường trong biểu mẫu.');
      return;
    }

    // ✅ Nếu hợp lệ, tiếp tục gọi API
    this.lichTiemService.addLichTiem(this.newLichTiem).subscribe({
      next: (newLichTiem) => {
        alert('✅ Tạo lịch tiêm thành công');

        // Cập nhật danh sách hiện tại
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
          modal?.hide();
          document
            .querySelectorAll('.modal-backdrop')
            ?.forEach((el) => el.remove());
        }
      },
      error: (err) => {
        alert('❌ Lỗi khi tạo lịch tiêm: ' + err.message);
      },
    });
  }

  chonLichTiemDeSua(lichtiem: LichTiemExt) {
    let ngayTiemObj = lichtiem.ngayTiem;

    // Nếu là chuỗi ngày, chuyển sang Date rồi lấy year, month, day
    if (typeof ngayTiemObj === 'string') {
      const date = new Date(ngayTiemObj);
      ngayTiemObj = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }

    this.newLichTiem = {
      ...lichtiem,
      ngayTiem: ngayTiemObj,
    };
  }

  capNhatLichTiem() {
    console.log('Dữ liệu newLichTiem trước khi cập nhật:', this.newLichTiem);
    this.lichTiemService
      .updateLichTiem(this.newLichTiem.maLichTiem, this.newLichTiem)
      .subscribe({
        next: (updatedLichTiem) => {
          alert('Cập nhật lịch tiêm thành công');

          // Cập nhật lại đối tượng trong danh sách
          const index = this.danhSachLichTiem.findIndex(
            (lt) => lt.maLichTiem === updatedLichTiem.maLichTiem
          );
          if (index !== -1) {
            this.danhSachLichTiem[index] = {
              ...updatedLichTiem,
              maVacNavigation:
                this.vaccines.find((v) => v.maVac === updatedLichTiem.maVac) ||
                null,
              maDotNavigation:
                this.dotTiems.find((d) => d.maDot === updatedLichTiem.maDot) ||
                null,
              maCbNavigation:
                this.canBoYtes.find((c) => c.maCb === updatedLichTiem.maCb) ||
                null,
              maNdNavigation:
                this.nguoiDans.find((n) => n.maNd === updatedLichTiem.maNd) ||
                null,
            };
          }

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

          // Đóng modal (giả sử modal cập nhật có id này)
          const modalElement = document.getElementById('capNhatLichTiemModal');
          if (modalElement) {
            const modal = (window as any).bootstrap.Modal.getInstance(
              modalElement
            );
            modal.hide();
          }
        },
        error: (err) => {
          alert('Lỗi khi cập nhật lịch tiêm: ' + err.message);
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
                  maNd: this.currentMaNd,
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
  xoaLichTiem(maLichTiem: number) {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch tiêm này?')) return;

    this.lichTiemService.deleteLichTiem(maLichTiem).subscribe({
      next: () => {
        // Tìm index
        const index = this.danhSachLichTiem.findIndex(
          (lt) => lt.maLichTiem === maLichTiem
        );
        if (index !== -1) {
          // Gán lại mảng mới để Angular detect thay đổi
          this.danhSachLichTiem = [
            ...this.danhSachLichTiem.slice(0, index),
            ...this.danhSachLichTiem.slice(index + 1),
          ];
        }
        alert('Xóa lịch tiêm thành công');
      },
      error: (err) => {
        console.error('Lỗi khi xóa:', err);
        alert('Không thể xóa lịch tiêm.');
      },
    });
  }
}
