import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Xác nhận component này là standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule], // Nhập ReactiveFormsModule và CommonModule
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'), // ít nhất 6 ký tự, chữ và số
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

    const { username, password } = this.loginForm.value;

    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('fullName', res.user.fullName);

        // Chuyển hướng theo role
        if (res.user.role === 'BaMe') this.router.navigate(['/parent']);
        else if (res.user.role === 'YTe') this.router.navigate(['/nurse']);
        else this.router.navigate(['/admin']);
      },
      error: () => {
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      },
    });
  }
}
