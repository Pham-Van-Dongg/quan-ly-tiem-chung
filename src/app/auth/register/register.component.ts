import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { TaiKhoan } from '../../model/model-chung.model';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: RegisterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).{6,}$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mustMatch: true };
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  submitted = false;
  loaitk = 0;
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      console.log('Form không hợp lệ:', this.registerForm.errors);
      return;
    }

    const { username, password } = this.registerForm.value;

    const data: TaiKhoan = {
      maTk: 0,
      tenDangNhap: username,
      matKhau: password,
      loaiTaiKhoan: this.loaitk,
      maNd: null,
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        localStorage.setItem('username', res.tenDangNhap || username);
        alert('Đăng ký thành công!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Lỗi từ API:', err);
        this.errorMessage =
          err.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      },
    });
  }
}
