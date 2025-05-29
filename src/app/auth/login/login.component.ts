import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Xác nhận component này là standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // Nhập ReactiveFormsModule và CommonModule
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/),
        ],
      ],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.loginError = null;

    const credentials = {
      tenDangNhap: this.username?.value,
      matKhau: this.password?.value,
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.authService.saveToLocalStorage(res);
        this.router.navigate(['//lichtiem']); // Điều hướng sau khi đăng nhập thành công
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Đăng nhập thất bại:', err);

        // ✅ Gán lỗi từ API trả về
        this.loginError = err.error || 'Đăng nhập thất bại. Vui lòng thử lại.';
        this.isSubmitting = false;
      },
    });
  }
}
