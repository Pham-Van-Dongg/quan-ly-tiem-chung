declare var bootstrap: any;
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validator,
  Validators,
} from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LichTiemService } from '../../services/lich-tiem.service';
import { CanBoYteService } from '../../services/can-bo.service';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  LichTiem,
  DotTiem,
  CanBoYte,
  NguoiDung,
  Vaccine,
  DateObject,
} from '../../model/model-chung.model';
import { NguoidanService } from '../../services/nguoidan.service';
import { LichTiemFilter } from './lich-tiem-filter.pipe';
import { DotTiemService } from '../../services/dot-tiem.service';
import { VacxinService } from '../../services/vacxin.service';

@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    LichTiemFilter,
    NgxPaginationModule,
  ],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichTiemComponent implements OnInit {
  nguoiDans: NguoiDung[] = [];
  vaccines: Vaccine[] = [];
  dotTiems: DotTiem[] = [];
  canBoYtes: CanBoYte[] = [];
  selectedMaNd: number | null = null;
  danhSachLichTiem: LichTiem[] = [];
  error: string = '';
  page: number = 1;
  lichtiem: any = {
    maVac: '',
    muiThu: '',
    ngayTiem: '',
    maDot: '',
    maNd: '',
    maCb: '',
    trangThai: '',
  };

  constructor(
    private NguoidanService: NguoidanService,
    private LichTiemService: LichTiemService,
    private VacxinService: VacxinService,
    private DotTiemService: DotTiemService,
    private CanBoYteService: CanBoYteService
  ) {}
  ngOnInit(): void {
    this.NguoidanService.getDanhSachNguoiDan().subscribe({
      next: (data) => (this.nguoiDans = data),
      error: (err) => (this.error = err.message),
    });
    this.VacxinService.getDanhSachVaccine().subscribe({
      next: (data) => (this.vaccines = data),
      error: (err) => (this.error = err.message),
    });
    this.DotTiemService.getDanhSachDotTiem().subscribe({
      next: (data) => (this.dotTiems = data),
      error: (err) => (this.error = err.message),
    });
    this.CanBoYteService.getDanhSachCanBo().subscribe({
      next: (data) => (this.canBoYtes = data),
      error: (err) => (this.error = err.message),
    });
    this.LichTiemService.getDanhSachLichTiem().subscribe({
      next: (data) => (this.danhSachLichTiem = data),
      error: (err) => (this.error = err.message),
    });
  }
  initialEmptyLichTiem: LichTiem = {
    maLichTiem: 0,
    maNd: 0,
    maVac: 0,
    maDot: 0,
    maCb: 0,
    ngayTiem: { day: 0, month: 0, year: 0 },
    muiThu: 0,
    trangThai: '',
  };

  newLichTiem: LichTiem = { ...this.initialEmptyLichTiem };
  luuLichTiem() {
    this.LichTiemService.addLichTiem(this.newLichTiem).subscribe({
      next: () => {
        alert('Tạo lịch tiêm thành công');
        this.newLichTiem = { ...this.initialEmptyLichTiem }; // reset
      },
      error: (err) => alert('Lỗi khi tạo lịch tiêm: ' + err.message),
    });
  }
  tuKhoaTimKiem: string = '';
}
