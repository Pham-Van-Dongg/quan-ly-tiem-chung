import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Main layout (có sidebar)
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
        pathMatch: 'full',
      },
      {
        path: 'danhsachbe',
        loadComponent: () =>
          import('./pages/danhsachbe/danhsachbe.component').then(
            (m) => m.DanhsachbeComponent
          ),
      },
      {
        path: 'loaitiemchung',
        loadComponent: () =>
          import('./pages/loaitiemchung/loaitiemchung.component').then(
            (m) => m.LoaitiemchungComponent
          ),
      },
      {
        path: 'lichtiem',
        loadComponent: () =>
          import('./pages/lichtiem/lichtiem.component').then(
            (m) => m.LichtiemComponent
          ),
      },
      {
        path: 'loaivacxin',
        loadComponent: () =>
          import('./pages/loaivacxin/loaivacxin.component').then(
            (m) => m.LoaivacxinComponent
          ),
      },
    ],
  },

  // Auth layout (không sidebar)
  {
    path: '',
    loadComponent: () =>
      import('./layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },

  // fallback route
  { path: '**', redirectTo: '' },
];
