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
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
            Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validator để kiểm tra password và confirmPassword khớp nhau
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

  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.log('Form không hợp lệ:', this.registerForm.errors);
      return;
    }

    const { username, password } = this.registerForm.value; // Loại bỏ confirmPassword
    console.log('Dữ liệu gửi đi:', { username, password });

    this.authService.register({ username, password }).subscribe({
      next: (res) => {
        console.log('Phản hồi từ API:', res);
        this.router.navigate(['/login']); // Chuyển về đăng nhập
      },
      error: (err) => {
        console.error('Lỗi từ API:', err);
        this.errorMessage =
          err.error?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      },
    });
  }
}
