declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CanBoYteService } from '../../services/can-bo.service';
import { CanBoYte, LichTiem, DateObject } from './canboyte.model';

@Component({
  selector: 'app-canboyte',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './canboyte.component.html',
  styleUrl: './canboyte.component.css',
})
export class CanboyteComponent implements OnInit {
  danhSachCanBo: CanBoYte[] = [];
  filteredCanBo: CanBoYte[] = [];
  paginatedCanBo: CanBoYte[] = [];
  formCanBo: CanBoYte = {
    maCb: 0,
    hoTen: '',
    soDienThoai: '',
    chucVu: '',
    donViCongTac: '',
    lichTiems: [],
  };
  formLichTiem: LichTiem = {
    maLichTiem: 0,
    maNd: 0,
    maVac: 0,
    maDot: 0,
    maCb: 0,
    ngayTiem: { year: 0, month: 0, day: 0 },
    muiThu: 0,
    trangThai: '',
  };
  isEditMode = false;
  isEditLichTiemMode = false;
  searchTerm: string = '';
  sortKey: keyof CanBoYte | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private canBoService: CanBoYteService) {}

  ngOnInit() {
    this.loadCanBoYtes();
  }

  loadCanBoYtes() {
    this.canBoService.getCanBoYtes().subscribe({
      next: (data) => {
        this.danhSachCanBo = data;
        this.filterCanBo();
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách cán bộ:', err);
        alert('Không thể tải danh sách cán bộ. Vui lòng thử lại!');
      },
    });
  }

  moFormThem() {
    this.isEditMode = false;
    this.formCanBo = {
      maCb: 0,
      hoTen: '',
      soDienThoai: '',
      chucVu: '',
      donViCongTac: '',
      lichTiems: [],
    };
  }

  suaCanBo(maCb: number) {
    this.isEditMode = true;
    this.canBoService.getCanBoById(maCb).subscribe({
      next: (canBo) => {
        this.formCanBo = { ...canBo, lichTiems: canBo.lichTiems || [] };
      },
      error: (err) => {
        console.error('Lỗi khi lấy chi tiết cán bộ:', err);
        alert('Không thể tải thông tin cán bộ. Vui lòng thử lại!');
      },
    });
  }

  xoaCanBo(canBo: CanBoYte) {
    if (confirm('Bạn có chắc muốn xóa cán bộ này?')) {
      this.canBoService.deleteCanBo(canBo.maCb).subscribe({
        next: () => {
          this.danhSachCanBo = this.danhSachCanBo.filter(
            (c) => c.maCb !== canBo.maCb
          );
          this.filterCanBo();
          alert('Xóa cán bộ thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi xóa cán bộ:', err);
          alert('Không thể xóa cán bộ. Vui lòng thử lại!');
        },
      });
    }
  }

  luuCanBo() {
    if (
      !this.formCanBo.hoTen ||
      !this.formCanBo.soDienThoai ||
      !this.formCanBo.chucVu ||
      !this.formCanBo.donViCongTac
    ) {
      alert('Vui lòng điền đầy đủ thông tin cán bộ!');
      return;
    }
    if (!/^[0-9]{10}$/.test(this.formCanBo.soDienThoai)) {
      alert('Số điện thoại phải gồm 10 chữ số!');
      return;
    }

    if (this.isEditMode) {
      this.canBoService
        .updateCanBo(this.formCanBo.maCb, this.formCanBo)
        .subscribe({
          next: () => {
            this.danhSachCanBo = this.danhSachCanBo.map((c) =>
              c.maCb === this.formCanBo.maCb ? { ...this.formCanBo } : c
            );
            this.filterCanBo();
            this.closeModal();
            alert('Cập nhật cán bộ thành công!');
          },
          error: (err) => {
            console.error('Lỗi khi cập nhật cán bộ:', err);
            alert('Không thể cập nhật cán bộ. Vui lòng thử lại!');
          },
        });
    } else {
      this.canBoService.addCanBo(this.formCanBo).subscribe({
        next: (newCanBo) => {
          this.danhSachCanBo.push(newCanBo);
          this.filterCanBo();
          this.closeModal();
          alert('Thêm cán bộ thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi thêm cán bộ:', err);
          alert('Không thể thêm cán bộ. Vui lòng thử lại!');
        },
      });
    }
  }

  // Quản lý LichTiem trong modal
  moFormThemLichTiem() {
    this.isEditLichTiemMode = false;
    this.formLichTiem = {
      maLichTiem: 0,
      maNd: 0,
      maVac: 0,
      maDot: 0,
      maCb: this.formCanBo.maCb,
      ngayTiem: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
      muiThu: 1,
      trangThai: 'Chưa tiêm',
    };
    this.openLichTiemModal();
  }

  suaLichTiem(lichTiem: LichTiem) {
    this.isEditLichTiemMode = true;
    this.formLichTiem = { ...lichTiem };
    this.openLichTiemModal();
  }

  xoaLichTiem(lichTiem: LichTiem) {
    if (confirm('Bạn có chắc muốn xóa lịch tiêm này?')) {
      this.formCanBo.lichTiems =
        this.formCanBo.lichTiems?.filter(
          (lt) => lt.maLichTiem !== lichTiem.maLichTiem
        ) || [];
    }
  }

  luuLichTiem() {
    if (
      !this.formLichTiem.maNd ||
      !this.formLichTiem.maVac ||
      !this.formLichTiem.maDot ||
      !this.formLichTiem.ngayTiem.year ||
      !this.formLichTiem.ngayTiem.month ||
      !this.formLichTiem.ngayTiem.day ||
      !this.formLichTiem.muiThu ||
      !this.formLichTiem.trangThai
    ) {
      alert('Vui lòng điền đầy đủ thông tin lịch tiêm!');
      return;
    }

    if (this.isEditLichTiemMode) {
      this.formCanBo.lichTiems =
        this.formCanBo.lichTiems?.map((lt) =>
          lt.maLichTiem === this.formLichTiem.maLichTiem
            ? { ...this.formLichTiem }
            : lt
        ) || [];
    } else {
      this.formCanBo.lichTiems = [
        ...(this.formCanBo.lichTiems || []),
        {
          ...this.formLichTiem,
          maLichTiem: (this.formCanBo.lichTiems?.length || 0) + 1,
        }, // Giả lập maLichTiem
      ];
    }
    this.closeLichTiemModal();
  }

  openLichTiemModal() {
    const modal = document.getElementById('modalLichTiem');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeLichTiemModal() {
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

  closeModal() {
    const modal = document.getElementById('modalCanBo');
    if (modal) {
      const bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  // Tìm kiếm
  filterCanBo() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCanBo = this.danhSachCanBo.filter(
      (canBo) =>
        canBo.hoTen.toLowerCase().includes(term) ||
        canBo.soDienThoai.toLowerCase().includes(term)
    );
    this.sortCanBo();
  }

  // Sắp xếp
  sort(key: keyof CanBoYte) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortCanBo();
  }

  sortCanBo() {
    if (this.sortKey) {
      const key = this.sortKey;
      this.filteredCanBo.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];
        if (key === 'maCb') {
          return this.sortDirection === 'asc'
            ? (valueA as number) - (valueB as number)
            : (valueB as number) - (valueA as number);
        } else {
          return this.sortDirection === 'asc'
            ? (valueA as string).localeCompare(valueB as string)
            : (valueB as string).localeCompare(valueA as string);
        }
      });
    }
    this.updatePagination();
  }

  // Phân trang
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCanBo.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedCanBo = this.filteredCanBo.slice(start, end);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
