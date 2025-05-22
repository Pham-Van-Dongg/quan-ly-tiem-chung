declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { DotTiemService } from '../../services/dot-tiem.service'; // đường dẫn đúng với project bạn
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DotTiem, DateObject } from '../../model/model-chung.model';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-dottiem',
  standalone: true,
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './dottiem.component.html',
  styleUrl: './dottiem.component.css',
})
export class DotTiemComponent implements OnInit {
  danhSachDotTiem: DotTiem[] = [];
  filteredDotTiem: DotTiem[] = [];
  formDot: any = {
    maDot: null,
    ngayBatDau: '',
    ngayKetThuc: '',
    diaDiem: '',
    trangThai: 'Sắp diễn ra',
  };
  isEdit: boolean = false;
  currentEditingId: number | null = null;

  // Tìm kiếm
  searchTerm: string = '';

  // Sắp xếp
  sortField: 'ngayBatDau' | 'ngayKetThuc' | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Phân trang
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private dotTiemService: DotTiemService) {}

  ngOnInit() {
    this.loadDanhSachDotTiem();
  }

  loadDanhSachDotTiem() {
    this.dotTiemService.getDanhSachDotTiem().subscribe({
      next: (data) => {
        this.danhSachDotTiem = data;
        this.applyFilterAndSort();
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách đợt tiêm:', err);
        alert('Không thể tải danh sách đợt tiêm. Vui lòng thử lại!');
      },
    });
  }

  applyFilterAndSort() {
    // Tìm kiếm
    let filtered = this.danhSachDotTiem;
    if (this.searchTerm) {
      filtered = filtered.filter((dot) =>
        dot.diaDiem.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (this.sortField) {
      filtered = [...filtered].sort((a, b) => {
        const field = this.sortField as 'ngayBatDau' | 'ngayKetThuc';
        const dateA = new Date(a[field].year, a[field].month - 1, a[field].day);
        const dateB = new Date(b[field].year, b[field].month - 1, b[field].day);
        return this.sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
    }

    this.filteredDotTiem = filtered;
    this.totalPages = Math.ceil(this.filteredDotTiem.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilterAndSort();
  }

  sort(column: 'ngayBatDau' | 'ngayKetThuc') {
    if (this.sortField === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column;
      this.sortDirection = 'asc';
    }
    this.applyFilterAndSort();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPaginatedDotTiem(): DotTiem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDotTiem.slice(start, start + this.pageSize);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  moFormThem() {
    this.isEdit = false;
    this.currentEditingId = null;
    this.formDot = {
      maDot: null,
      ngayBatDau: '',
      ngayKetThuc: '',
      diaDiem: '',
      trangThai: 'Sắp diễn ra',
    };
    this.openModal();
  }

  suaDot(dot: DotTiem) {
    this.isEdit = true;
    this.currentEditingId = dot.maDot;
    this.dotTiemService.getDotTiemById(dot.maDot).subscribe({
      next: (data) => {
        this.formDot = {
          maDot: data.maDot,
          ngayBatDau: this.formatDateObject(data.ngayBatDau),
          ngayKetThuc: this.formatDateObject(data.ngayKetThuc),
          diaDiem: data.diaDiem,
          trangThai: this.tinhTrangThai(data.ngayBatDau, data.ngayKetThuc),
        };
        this.openModal();
      },
      error: (err) => {
        console.error('Lỗi khi tải đợt tiêm:', err);
        alert('Không thể tải thông tin đợt tiêm. Vui lòng thử lại!');
      },
    });
  }

  xoaDot(dot: DotTiem) {
    if (confirm(`Bạn có chắc muốn xóa đợt tiêm ${dot.maDot}?`)) {
      this.dotTiemService.deleteDotTiem(dot.maDot).subscribe({
        next: () => {
          this.loadDanhSachDotTiem();
          alert('Xóa đợt tiêm thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi xóa đợt tiêm:', err);
          alert('Không thể xóa đợt tiêm. Vui lòng thử lại!');
        },
      });
    }
  }

  luuDotTiem() {
    if (
      !this.formDot.ngayBatDau ||
      !this.formDot.ngayKetThuc ||
      !this.formDot.diaDiem
    ) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const dotTiem: Partial<DotTiem> = {
      ngayBatDau: this.parseDateString(this.formDot.ngayBatDau),
      ngayKetThuc: this.parseDateString(this.formDot.ngayKetThuc),
      diaDiem: this.formDot.diaDiem,
      lichTiems: [],
    };

    if (this.isEdit && this.currentEditingId) {
      this.dotTiemService
        .updateDotTiem(this.currentEditingId, dotTiem)
        .subscribe({
          next: () => {
            this.loadDanhSachDotTiem();
            this.closeModal();
            alert('Cập nhật đợt tiêm thành công!');
          },
          error: (err) => {
            console.error('Lỗi khi cập nhật đợt tiêm:', err);
            alert('Không thể cập nhật đợt tiêm. Vui lòng thử lại!');
          },
        });
    } else {
      this.dotTiemService.createDotTiem(dotTiem).subscribe({
        next: (data) => {
          this.loadDanhSachDotTiem();
          this.closeModal();
          alert('Thêm đợt tiêm thành công!');
        },
        error: (err) => {
          console.error('Lỗi khi thêm đợt tiêm:', err);
          alert('Không thể thêm đợt tiêm. Vui lòng thử lại!');
        },
      });
    }
  }

  tinhTrangThai(ngayBatDau: DateObject, ngayKetThuc: DateObject): string {
    const today = new Date(2025, 4, 22); // Ngày hiện tại: 22/05/2025
    const batDau = new Date(
      ngayBatDau.year,
      ngayBatDau.month - 1,
      ngayBatDau.day
    );
    const ketThuc = new Date(
      ngayKetThuc.year,
      ngayKetThuc.month - 1,
      ngayKetThuc.day
    );

    if (today < batDau) return 'Sắp diễn ra';
    if (today > ketThuc) return 'Kết thúc';
    return 'Đang diễn ra';
  }

  openModal() {
    const modal = document.getElementById('modalDotTiem');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeModal() {
    const modal = document.getElementById('modalDotTiem');
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
    const date = new Date(year, month - 1, day);
    return {
      year,
      month,
      day,
      dayOfWeek: date.getDay() || 7,
    };
  }
}
