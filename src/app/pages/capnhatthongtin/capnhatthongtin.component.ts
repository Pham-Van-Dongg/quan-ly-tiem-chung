import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NguoidanService } from '../../services/nguoidan.service';
import { NguoiDung, DateObject } from '../../model/model-chung.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-capnhatthongtin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './capnhatthongtin.component.html',
  styleUrl: './capnhatthongtin.component.css',
})
export class CapnhatthongtinComponent implements OnInit {
  maNd: number = 0;
  nguoiDan: NguoiDung = {
    maNd: 0,
    hoTen: '',
    ngaySinh: '',
    gioiTinh: '',
    cmndCccd: '',
    diaChi: '',
    soDienThoai: '',
    lichTiems: [],
    taiKhoans: [],
  };

  constructor(
    private nguoidanService: NguoidanService,
    private authService: AuthService, // Thêm AuthService
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getUserFromLocalStorage();
    if (currentUser && currentUser.nguoiDung) {
      this.maNd = currentUser.nguoiDung.maNd; // Đảm bảo không null
    } else if (currentUser && currentUser.taiKhoan) {
      this.maNd = currentUser.taiKhoan.maNd ?? 0; // Dùng toán tử ?? để cung cấp giá trị mặc định nếu null
    } else {
      console.error('Không tìm thấy maNd trong localStorage');
      this.maNd = Number(this.route.snapshot.paramMap.get('id')) || 0; // Đảm bảo không null
    }

    if (this.maNd) {
      this.getThongTinNguoiDan();
    } else {
      console.error('Không có maNd để lấy thông tin người dân');
    }
  }
  getThongTinNguoiDan() {
    this.nguoidanService.getNguoiDanById(this.maNd).subscribe({
      next: (res) => {
        this.nguoiDan = {
          maNd: res.maNd,
          hoTen: res.hoTen,
          ngaySinh: res.ngaySinh,
          gioiTinh: res.gioiTinh,
          cmndCccd: res.cmndCccd,
          diaChi: res.diaChi,
          soDienThoai: res.soDienThoai,
          lichTiems: [],
          taiKhoans: [],
        };
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin người dân:', err);
      },
    });
  }

  capNhatThongTin() {
    const body: NguoiDung = {
      maNd: this.maNd,
      hoTen: this.nguoiDan.hoTen,
      ngaySinh: this.nguoiDan.ngaySinh,
      gioiTinh: this.nguoiDan.gioiTinh,
      cmndCccd: this.nguoiDan.cmndCccd,
      diaChi: this.nguoiDan.diaChi,
      soDienThoai: this.nguoiDan.soDienThoai,
      lichTiems: [],
      taiKhoans: [],
    };

    this.nguoidanService.updateNguoiDan(this.maNd, body).subscribe({
      next: () => {
        alert('Cập nhật thành công');
      },
      error: (err) => {
        console.error('Lỗi cập nhật:', err);
        alert('Cập nhật thất bại');
      },
    });
  }
}
