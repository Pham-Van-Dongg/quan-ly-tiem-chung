import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_ITEMS } from '../../menu-item';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  menuItems = MENU_ITEMS;
}
