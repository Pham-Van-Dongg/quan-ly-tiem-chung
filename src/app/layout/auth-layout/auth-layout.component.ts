import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
