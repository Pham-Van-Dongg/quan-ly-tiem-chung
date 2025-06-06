import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hoso-tiemchung',
  imports: [FormsModule, CommonModule],
  templateUrl: './hoso-tiemchung.component.html',
  styleUrl: './hoso-tiemchung.component.css',
})
export class HosoTiemchungComponent {
  danhSachBe = [
    { id: 1, ten: 'Bé An' },
    { id: 2, ten: 'Bé Bảo' },
  ];

  beDuocChon = this.danhSachBe[0];

  hoSoTiemChung: any[] = [];

  ngOnInit() {
    this.taiHoSo();
  }

  taiHoSo() {
    this.hoSoTiemChung = [
      {
        tenVaccine: 'Vắc xin 6 trong 1',
        soMui: 1,
        ngayTiem: new Date('2024-01-15'),
        trangThai: 'Đã tiêm',
        ghiChu: 'Không phản ứng.',
      },
      {
        tenVaccine: 'Vắc xin viêm gan B',
        soMui: 1,
        ngayTiem: null,
        trangThai: 'Chưa tiêm',
        ghiChu: '',
      },
    ];
  }

  taiLai() {
    this.taiHoSo();
  }
}
