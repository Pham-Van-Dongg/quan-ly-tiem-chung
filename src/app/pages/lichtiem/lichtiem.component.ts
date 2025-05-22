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

import { LichTiemService } from '../../services/lich-tiem.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichTiemComponent implements OnInit {
  danhSachLich: any[] = [];
  danhSachVac: any[] = [];
  danhSachDotTiem: any[] = [];
  danhSachCanBo: any[] = [];
  lichTiemLoc: any[] = [];
  lichTiemHienThi: any[] = [];

  tuKhoa: string = '';
  trangHienTai = 1;
  kichThuocTrang = 5;
  tongSoTrang = 1;
  tongTrangArray: number[] = [];

  lichTiemForm!: FormGroup;
  isEdit = false;
  currentEditingId: number | null = null;

  constructor(
    private lichTiemService: LichTiemService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadDanhSachVac();
    this.loadDanhSachDotTiem();
    this.loadDanhSachCanBo();
    this.initForm();
    this.layTatCaLichTiem();
  }

  layTatCaLichTiem() {
    this.lichTiemService.layTatCa().subscribe((res: any[]) => {
      this.danhSachLich = res;
      this.timKiem();
    });
  }

  timKiem() {
    const keyword = this.tuKhoa.toLowerCase().trim();
    this.lichTiemLoc = this.danhSachLich.filter(
      (lich) =>
        lich.maNdNavigation?.hoTen?.toLowerCase().includes(keyword) ||
        lich.maVacNavigation?.tenVac?.toLowerCase().includes(keyword) ||
        lich.maDotNavigation?.diaDiem?.toLowerCase().includes(keyword)
    );
    this.trangHienTai = 1;
    this.capNhatPhanTrang();
  }

  capNhatPhanTrang() {
    const batDau = (this.trangHienTai - 1) * this.kichThuocTrang;
    const ketThuc = batDau + this.kichThuocTrang;

    this.lichTiemHienThi = this.lichTiemLoc.slice(batDau, ketThuc);
    this.tongSoTrang = Math.ceil(this.lichTiemLoc.length / this.kichThuocTrang);
    this.tongTrangArray = Array.from(
      { length: this.tongSoTrang },
      (_, i) => i + 1
    );
  }

  chuyenTrang(trangMoi: number) {
    if (trangMoi >= 1 && trangMoi <= this.tongSoTrang) {
      this.trangHienTai = trangMoi;
      this.capNhatPhanTrang();
    }
  }

  loadDanhSachVac() {
    this.lichTiemService.getDanhSachVac().subscribe((data) => {
      this.danhSachVac = data;
    });
  }

  loadDanhSachDotTiem() {
    this.lichTiemService.getDanhSachDotTiem().subscribe((data) => {
      this.danhSachDotTiem = data;
    });
  }

  loadDanhSachCanBo() {
    this.lichTiemService.getDanhSachCanBo().subscribe((data) => {
      this.danhSachCanBo = data;
    });
  }

  initForm() {
    this.lichTiemForm = this.fb.group({
      year: [new Date().getFullYear(), Validators.required],
      month: [new Date().getMonth() + 1, Validators.required],
      day: [new Date().getDate(), Validators.required],
      maVac: [null, Validators.required],
      maDot: [null, Validators.required],
      maCb: [null, Validators.required],
      muiThu: [1, Validators.required],
      trangThai: ['', Validators.required],
    });
  }

  moPopupThem() {
    this.isEdit = false;
    this.currentEditingId = null;
    this.lichTiemForm.reset({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      muiThu: 1,
      trangThai: '',
    });
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }

  suaLich(lich: any) {
    this.isEdit = true;
    this.currentEditingId = lich.maLichTiem;
    this.lichTiemForm.patchValue({
      year: lich.ngayTiem.year,
      month: lich.ngayTiem.month,
      day: lich.ngayTiem.day,
      maVac: lich.maVac,
      maDot: lich.maDot,
      maCb: lich.maCb,
      muiThu: lich.muiThu,
      trangThai: lich.trangThai,
    });
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      new bootstrap.Modal(modal).show();
    }
  }

  dongPopup() {
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    }
  }

  onSubmit() {
    if (this.lichTiemForm.invalid) return;

    const formData = this.lichTiemForm.value;
    const lichMoi = {
      ngayTiem: {
        year: formData.year,
        month: formData.month,
        day: formData.day,
      },
      maVac: formData.maVac,
      maDot: formData.maDot,
      maCb: formData.maCb,
      muiThu: formData.muiThu,
      trangThai: formData.trangThai,
    };

    if (this.isEdit && this.currentEditingId) {
      this.lichTiemService
        .suaLich(this.currentEditingId, lichMoi)
        .subscribe(() => {
          this.layTatCaLichTiem();
          this.dongPopup();
        });
    } else {
      this.lichTiemService.themLich(lichMoi).subscribe(() => {
        this.layTatCaLichTiem();
        this.dongPopup();
      });
    }
  }

  xoaLich(lich: any) {
    if (!confirm('Bạn có chắc muốn xoá lịch tiêm này?')) return;
    this.lichTiemService.xoaLich(lich.maLichTiem).subscribe(() => {
      this.layTatCaLichTiem();
    });
  }
}
