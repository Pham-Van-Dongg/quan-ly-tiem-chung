import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loaivacxin',
  imports: [FormsModule, NgFor],
  templateUrl: './loaivacxin.component.html',
  styleUrl: './loaivacxin.component.css',
})
export class LoaivacxinComponent {
  danhSachVaccine = [
    {
      id: 1,
      ten: 'Vắc xin 6 trong 1',
      soMui: 3,
      khoangCach: 30,
      nhaSanXuat: 'Sanofi',
      moTa: 'Ngừa 6 bệnh thường gặp cho trẻ sơ sinh.',
    },
    {
      id: 2,
      ten: 'Vắc xin viêm gan B',
      soMui: 3,
      khoangCach: 28,
      nhaSanXuat: 'VNVC',
      moTa: 'Ngừa viêm gan B.',
    },
  ];

  formVaccine: any = {};
  dangSua: boolean = false;

  moFormThem() {
    this.formVaccine = {
      ten: '',
      soMui: 1,
      khoangCach: 0,
      nhaSanXuat: '',
      moTa: '',
    };
    this.dangSua = false;
  }

  suaVaccine(vac: any) {
    this.formVaccine = { ...vac };
    this.dangSua = true;

    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('modalVaccine')
    );
    modal.show();
  }

  luuVaccine() {
    if (this.dangSua) {
      const index = this.danhSachVaccine.findIndex(
        (v) => v.id === this.formVaccine.id
      );
      if (index !== -1) {
        this.danhSachVaccine[index] = { ...this.formVaccine };
      }
    } else {
      const newId = Math.max(...this.danhSachVaccine.map((v) => v.id), 0) + 1;
      this.danhSachVaccine.push({ ...this.formVaccine, id: newId });
    }

    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById('modalVaccine')
    );
    modal.hide();
  }

  xoaVaccine(vac: any) {
    if (confirm('Bạn có chắc muốn xóa loại vắc xin này?')) {
      this.danhSachVaccine = this.danhSachVaccine.filter(
        (v) => v.id !== vac.id
      );
    }
  }
}
