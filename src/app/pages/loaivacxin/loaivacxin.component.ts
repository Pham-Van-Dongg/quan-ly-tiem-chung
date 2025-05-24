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
    this.VacxinService.addVacccine(this.newVaccine).subscribe({
      next: (data) => {
        this.danhSachVaccine.push(data);
        this.newVaccine = {
          maVac: 0,
          tenVac: '',
          hangSanXuat: '',
          soMui: 0,
          thoiGianGiuaMui: 0,
          lichTiems: [],
        };
        // Đóng modal bằng Bootstrap JS
        const modalElement = document.getElementById('themVaccineModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
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
    this.capNhatVaccine(this.vaccineDangSua);
  }
  capNhatVaccine(vaccineDaSua: any) {
    const index = this.danhSachVaccine.findIndex(
      (vc) => vc.maVac === vaccineDaSua.maVac
    );
    if (index !== -1) {
      this.danhSachVaccine[index] = { ...vaccineDaSua };
    }
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
