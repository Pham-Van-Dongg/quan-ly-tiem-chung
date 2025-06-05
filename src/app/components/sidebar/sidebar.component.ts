import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_ITEMS, MenuItem } from '../../menu-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const loaiTaiKhoan = Number(userData?.taiKhoan?.loaiTaiKhoan);

    if (loaiTaiKhoan === 1) {
      this.menuItems = MENU_ITEMS; // Admin
    } else if (loaiTaiKhoan === 2) {
      this.menuItems = MENU_ITEMS.filter((item) =>
        ['/lichtiem', '/capnhatthongtin', '/lichsudangky', '/chatbot'].includes(
          item.route
        )
      );
    } else {
      this.menuItems = [];
    }
  }
}
