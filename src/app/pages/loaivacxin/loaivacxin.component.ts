declare var bootstrap: any;
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VacxinService } from '../../services/vacxin.service';
import { Vaccine, DateObject } from '../../model/model-chung.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { VaccineFilterPipe } from './vaccine-filter.pipe';
@Component({
  selector: 'app-loaivacxin',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    VaccineFilterPipe,
  ],
  templateUrl: './loaivacxin.component.html',
  styleUrl: './loaivacxin.component.css',
})
export class LoaivacxinComponent {
  danhSachVaccine: Vaccine[] = [];
  error: string = '';
  page: number = 1;
  tuKhoaTimKiem: string = '';
  constructor(private VacxinService: VacxinService) {}

  ngOnInit(): void {
    this.VacxinService.getDanhSachVaccine().subscribe({
      next: (data) => (this.danhSachVaccine = data),
      error: (err) => (this.error = err.message),
    });
  }
  newVaccine: Vaccine = {
    maVac: 0,
    tenVac: '',
    hangSanXuat: '',
    soMui: 0,
    thoiGianGiuaMui: 0,
    lichTiems: [],
  };
  themVaccine(): void {
    if (
      !this.newVaccine.tenVac ||
      !this.newVaccine.hangSanXuat ||
      this.newVaccine.soMui <= 0 ||
      this.newVaccine.thoiGianGiuaMui <= 0
    ) {
      alert('Vui lòng điền đầy đủ và chính xác thông tin vắc xin.');
      return;
    }

    this.VacxinService.addVacccine(this.newVaccine).subscribe({
      next: (data) => {
        this.danhSachVaccine.push(data);
        this.tuKhoaTimKiem = '';
        this.page = 1;
        this.newVaccine = {
          maVac: 0,
          tenVac: '',
          hangSanXuat: '',
          soMui: 0,
          thoiGianGiuaMui: 0,
          lichTiems: [],
        };
        const modalEl = document.getElementById('themVaccineModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal.hide();
        }
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        alert('Thêm thành công');
      },
      error: (err) => {
        console.error(err);
        alert('Có lỗi xảy ra khi thêm vắc xin.');
      },
    });
  }

  selectedVaccine: Vaccine | null = null;

  xemChiTiet(maVac: number): void {
    this.VacxinService.getVaccineById(maVac).subscribe({
      next: (data) => {
        this.selectedVaccine = data;
        const modal = new bootstrap.Modal(
          document.getElementById('chiTietModal')
        );
        modal.show();
      },
      error: (err) => {
        console.error(err);
        alert('Không thể tải chi tiết Vắc xin');
      },
    });
  }
  vaccineDangSua: any = {};
  batDauSua(vaccine: any) {
    this.vaccineDangSua = { ...vaccine };
  }
  luuChinhSua() {
    if (
      !this.vaccineDangSua.tenVac ||
      !this.vaccineDangSua.hangSanXuat ||
      this.vaccineDangSua.soMui <= 0 ||
      this.vaccineDangSua.thoiGianGiuaMui <= 0
    ) {
      alert('Vui lòng kiểm tra lại thông tin đã nhập.');
      return;
    }

    this.capNhatVaccine(this.vaccineDangSua);
  }

  capNhatVaccine(vaccineDaSua: any) {
    this.VacxinService.updateVaccine(
      vaccineDaSua.maVac,
      vaccineDaSua
    ).subscribe({
      next: (updated) => {
        // Gọi lại danh sách và cập nhật giao diện
        this.VacxinService.getDanhSachVaccine().subscribe({
          next: (danhSachMoi) => {
            this.danhSachVaccine = danhSachMoi; // Cập nhật danh sách hiển thị
          },
          error: (err) => {
            console.error('Lỗi khi lấy danh sách vaccine:', err);
          },
        });

        // Đóng modal
        const modalElement = document.getElementById('suaVaccineModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();

        this.vaccineDangSua = {};
        alert('Cập nhật thành công');
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật:', err);
        alert('Cập nhật thất bại');
      },
    });
  }

  xoaVaccine(maVac: number) {
    if (confirm('Bạn có chắc chắn muốn xóa vắc xin này không?')) {
      this.VacxinService.deleteVaccine(maVac).subscribe({
        next: () => {
          this.danhSachVaccine = this.danhSachVaccine.filter(
            (vc) => vc.maVac !== maVac
          );
          alert('Xóa thành công');
        },
        error: (err) => {
          console.error('Lỗi khi xóa:', err);
          alert('Xóa thất bại');
        },
      });
    }
  }
}
