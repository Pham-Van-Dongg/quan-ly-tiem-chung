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
import { CanBoYteService } from '../../services/can-bo.service';
import {
  LichTiem,
  DotTiem,
  CanBoYte,
  NguoiDung,
  Vaccine,
  DateObject,
} from '../../model/model-chung.model';

@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichTiemComponent implements OnInit {
  danhSachLich: LichTiem[] = [];
  lichTiemLoc: LichTiem[] = [];
  lichTiemHienThi: LichTiem[] = [];
  danhSachCanBo: CanBoYte[] = [];
  danhSachDotTiem: DotTiem[] = [];
  danhSachNguoiDung: NguoiDung[] = [];
  danhSachVac: Vaccine[] = [];
  tuKhoa: string = '';
  trangHienTai: number = 1;
  kichThuocTrang: number = 5;
  tongSoTrang: number = 1;
  tongTrangArray: number[] = [];
  lichTiemForm: FormGroup;
  isEdit: boolean = false;
  currentEditingId: number | null = null;
  sortKey:
    | keyof LichTiem
    | 'maVacNavigation'
    | 'maDotNavigation'
    | 'maCbNavigation'
    | 'maNdNavigation'
    | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private lichTiemService: LichTiemService,
    private canBoService: CanBoYteService,
    private fb: FormBuilder
  ) {
    this.lichTiemForm = this.fb.group({
      maNd: [null, Validators.required],
      maVac: [null, Validators.required],
      maDot: [null, Validators.required],
      maCb: [null, Validators.required],
      ngayTiem: ['', Validators.required],
      muiThu: [1, [Validators.required, Validators.min(1)]],
      trangThai: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadDanhSachLich();
    this.loadDanhSachVac();
    this.loadDanhSachDotTiem();
    this.loadDanhSachCanBo();
    this.loadDanhSachNguoiDung();
  }

  loadDanhSachLich() {
    this.lichTiemService.getAllLichTiem().subscribe({
      next: (data) => {
        this.danhSachLich = data;
        this.timKiem();
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách lịch tiêm:', err);
        alert('Không thể tải danh sách lịch tiêm. Vui lòng thử lại!');
      },
    });
  }

  loadDanhSachVac() {
    this.lichTiemService.getDanhSachVac().subscribe({
      next: (data) => {
        this.danhSachVac = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách vắc xin:', err);
        alert('Không thể tải danh sách vắc xin. Vui lòng thử lại!');
      },
    });
  }

  loadDanhSachDotTiem() {
    this.lichTiemService.getDanhSachDotTiem().subscribe({
      next: (data) => {
        this.danhSachDotTiem = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đợt tiêm:', err);
        alert('Không thể tải danh sách đợt tiêm. Vui lòng thử lại!');
      },
    });
  }

  loadDanhSachCanBo() {
    this.canBoService.getCanBoYtes().subscribe({
      next: (data) => {
        this.danhSachCanBo = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách cán bộ:', err);
        alert('Không thể tải danh sách cán bộ. Vui lòng thử lại!');
      },
    });
  }

  loadDanhSachNguoiDung() {
    this.lichTiemService.getDanhSachNguoiDung().subscribe({
      next: (data) => {
        this.danhSachNguoiDung = data;
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách người dùng:', err);
        alert('Không thể tải danh sách người dùng. Vui lòng thử lại!');
      },
    });
  }

  timKiem() {
    const keyword = this.tuKhoa.toLowerCase().trim();
    this.lichTiemLoc = this.danhSachLich.filter(
      (lich) =>
        lich.maNdNavigation?.hoTen?.toLowerCase().includes(keyword) ||
        lich.maVacNavigation?.tenVac?.toLowerCase().includes(keyword) ||
        lich.maDotNavigation?.diaDiem?.toLowerCase().includes(keyword) ||
        lich.maCbNavigation?.hoTen?.toLowerCase().includes(keyword)
    );
    this.sortLich();
    this.trangHienTai = 1;
    this.capNhatPhanTrang();
  }

  sort(
    key:
      | keyof LichTiem
      | 'maVacNavigation'
      | 'maDotNavigation'
      | 'maCbNavigation'
      | 'maNdNavigation'
  ) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortLich();
  }

  sortLich() {
    if (this.sortKey) {
      const key = this.sortKey;
      this.lichTiemLoc.sort((a, b) => {
        let valueA: any = a[key as keyof LichTiem];
        let valueB: any = b[key as keyof LichTiem];
        if (key === 'ngayTiem') {
          valueA = this.formatDateObject(a.ngayTiem);
          valueB = this.formatDateObject(b.ngayTiem);
        } else if (key === 'maVacNavigation') {
          valueA = a.maVacNavigation?.tenVac;
          valueB = b.maVacNavigation?.tenVac;
        } else if (key === 'maDotNavigation') {
          valueA = a.maDotNavigation?.diaDiem;
          valueB = b.maDotNavigation?.diaDiem;
        } else if (key === 'maCbNavigation') {
          valueA = a.maCbNavigation?.hoTen;
          valueB = b.maCbNavigation?.hoTen;
        } else if (key === 'maNdNavigation') {
          valueA = a.maNdNavigation?.hoTen;
          valueB = b.maNdNavigation?.hoTen;
        }
        if (typeof valueA === 'number') {
          return this.sortDirection === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }
        return this.sortDirection === 'asc'
          ? (valueA || '').localeCompare(valueB || '')
          : (valueB || '').localeCompare(valueA || '');
      });
    }
    this.capNhatPhanTrang();
  }

  capNhatPhanTrang() {
    this.tongSoTrang = Math.ceil(this.lichTiemLoc.length / this.kichThuocTrang);
    const batDau = (this.trangHienTai - 1) * this.kichThuocTrang;
    const ketThuc = batDau + this.kichThuocTrang;
    this.lichTiemHienThi = this.lichTiemLoc.slice(batDau, ketThuc);
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

  getPages(): number[] {
    return this.tongTrangArray;
  }

  moPopupThem() {
    this.isEdit = false;
    this.currentEditingId = null;
    this.lichTiemForm.reset({
      maNd: null,
      maVac: null,
      maDot: null,
      maCb: null,
      ngayTiem: this.formatDateObject({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      }),
      muiThu: 1,
      trangThai: 'Chưa tiêm',
    });
    this.openModal();
  }

  suaLich(lich: LichTiem) {
    this.isEdit = true;
    this.currentEditingId = lich.maLichTiem;
    this.lichTiemForm.patchValue({
      maNd: lich.maNd,
      maVac: lich.maVac,
      maDot: lich.maDot,
      maCb: lich.maCb,
      ngayTiem: this.formatDateObject(lich.ngayTiem),
      muiThu: lich.muiThu,
      trangThai: lich.trangThai,
    });
    this.openModal();
  }

  xoaLich(lich: LichTiem) {
    if (confirm(`Bạn có chắc muốn xóa lịch tiêm ${lich.maLichTiem}?`)) {
      this.lichTiemService.deleteLichTiem(lich.maLichTiem).subscribe({
        next: () => {
          this.danhSachLich = this.danhSachLich.filter(
            (l) => l.maLichTiem !== lich.maLichTiem
          );
          this.timKiem();
          alert('Xóa lịch tiêm thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi xóa lịch tiêm:', err);
          alert('Không thể xóa lịch tiêm. Vui lòng thử lại!');
        },
      });
    }
  }

  onSubmit() {
    if (this.lichTiemForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin lịch tiêm!');
      return;
    }

    const formData = this.lichTiemForm.value;
    const lichTiem: Partial<LichTiem> = {
      maNd: formData.maNd,
      maVac: formData.maVac,
      maDot: formData.maDot,
      maCb: formData.maCb,
      ngayTiem: this.parseDateString(formData.ngayTiem),
      muiThu: formData.muiThu,
      trangThai: formData.trangThai,
    };

    if (this.isEdit && this.currentEditingId) {
      this.lichTiemService
        .updateLichTiem(this.currentEditingId, lichTiem)
        .subscribe({
          next: () => {
            this.loadDanhSachLich();
            this.closeModal();
            alert('Cập nhật lịch tiêm thành công!');
          },
          error: (err) => {
            console.error('Lỗi khi cập nhật lịch tiêm:', err);
            alert('Không thể cập nhật lịch tiêm. Vui lòng thử lại!');
          },
        });
    } else {
      this.lichTiemService.createLichTiem(lichTiem).subscribe({
        next: () => {
          this.loadDanhSachLich();
          this.closeModal();
          alert('Thêm lịch tiêm thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi thêm lịch tiêm:', err);
          alert('Không thể thêm lịch tiêm. Vui lòng thử lại!');
        },
      });
    }
  }

  openModal() {
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeModal() {
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  formatDateObject(date: DateObject): string {
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day
      .toString()
      .padStart(2, '0')}`;
  }

  parseDateString(dateStr: string): DateObject {
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month, day };
  }
}
