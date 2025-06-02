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
import {
  LichTiem,
  Vaccine,
  DotTiem,
  CanBoYte,
  NguoiDung,
  DateObject,
} from '../../model/model-chung.model';
import { forkJoin } from 'rxjs';

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
  nguoiDans: NguoiDung[] = [];
  vaccines: Vaccine[] = [];
  dotTiems: DotTiem[] = [];
  canBoYtes: CanBoYte[] = [];
  danhSachLichTiem: LichTiem[] = [];
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
    private canBoYteService: CanBoYteService
  ) {}

  ngOnInit(): void {
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
}
