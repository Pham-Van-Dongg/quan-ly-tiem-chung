import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TaiKhoan, NguoiDung } from '../../model/model-chung.model';
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
  currentUser: { taiKhoan: TaiKhoan; nguoiDung: NguoiDung | null } | null =
    null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserFromLocalStorage();
    console.log('User from localStorage:', this.currentUser);
  }

  dangXuat(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
