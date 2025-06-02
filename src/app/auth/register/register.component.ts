import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { NguoiDung } from '../../model/model-chung.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        tenDangNhap: ['', [Validators.required, Validators.minLength(3)]],
        matKhau: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        hoTen: ['', Validators.required],
        ngaySinh: ['', Validators.required],
        gioiTinh: ['', Validators.required],
        cmndCccd: ['', [Validators.required, Validators.pattern(/^\d{9,12}$/)]],
        diaChi: ['', Validators.required],
        soDienThoai: [
          '',
          [Validators.required, Validators.pattern(/^\d{10,11}$/)],
        ],
      },
      {
        validators: this.mustMatch('matKhau', 'confirmPassword'),
      }
    );
  }

  // Custom validator để so khớp mật khẩu
  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl) => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }

  // Getter cho các form controls
  get username() {
    return this.registerForm.get('tenDangNhap');
  }

  get password() {
    return this.registerForm.get('matKhau');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get hoTen() {
    return this.registerForm.get('hoTen');
  }

  get ngaySinh() {
    return this.registerForm.get('ngaySinh');
  }

  get gioiTinh() {
    return this.registerForm.get('gioiTinh');
  }

  get cmndCccd() {
    return this.registerForm.get('cmndCccd');
  }

  get diaChi() {
    return this.registerForm.get('diaChi');
  }

  get soDienThoai() {
    return this.registerForm.get('soDienThoai');
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.invalid) {
      console.log('Form không hợp lệ:', this.registerForm.errors);
      return;
    }

    // Chuẩn bị dữ liệu theo model NguoiDung
    const formData: NguoiDung = {
      maNd: 0, // API sẽ tự sinh maNd
      hoTen: this.registerForm.get('hoTen')?.value,
      ngaySinh: this.registerForm.get('ngaySinh')?.value,
      gioiTinh: this.registerForm.get('gioiTinh')?.value,
      cmndCccd: this.registerForm.get('cmndCccd')?.value,
      diaChi: this.registerForm.get('diaChi')?.value,
      soDienThoai: this.registerForm.get('soDienThoai')?.value,
      taiKhoans: [
        {
          maTk: 0, // API sẽ tự sinh maTk
          tenDangNhap: this.registerForm.get('tenDangNhap')?.value,
          matKhau: this.registerForm.get('matKhau')?.value,
          loaiTaiKhoan: 1, // Giả sử 1 là tài khoản người dùng thông thường
          maNd: null, // API sẽ liên kết sau khi tạo NguoiDung
        },
      ],
    };

    this.registerService.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';
        this.registerForm.reset();
        this.submitted = false;

        // Kiểm tra localStorage sau khi đăng ký
        console.log('currentUser:', localStorage.getItem('currentUser'));
        console.log('username:', localStorage.getItem('username'));
        console.log('userData:', localStorage.getItem('userData'));

        setTimeout(() => {
          this.router.navigate(['/lichtiem']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage =
          error.message || 'Đăng ký thất bại, vui lòng thử lại.';
        console.error('Lỗi đăng ký:', error);
      },
    });
  }
}
