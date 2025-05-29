import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TaiKhoan } from '../../model/model-chung.model';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, NgIf],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  currentUser: TaiKhoan | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const userString = localStorage.getItem('currentUser');
    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser') || 'null'
    );
    console.log('User from localStorage:', userString);
    this.currentUser = userString ? JSON.parse(userString) : null;
  }
  dangXuat(): void {
    localStorage.removeItem('currentUser');
    this.authService.logout(); // nếu bạn có logic thêm ở đây
    this.router.navigate(['/login']); // điều hướng về trang đăng nhập
  }
}
