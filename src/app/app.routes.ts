import { Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HosoTiemchungComponent } from './pages/hoso-tiemchung/hoso-tiemchung.component';

import { provideHttpClient } from '@angular/common/http';
import { CanboyteComponent } from './pages/canboyte/canboyte.component';
import { TaikhoanComponent } from './pages/taikhoan/taikhoan.component';
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
            (m) => m.LichTiemComponent
          ),
      },
      {
        path: 'loaivacxin',
        loadComponent: () =>
          import('./pages/loaivacxin/loaivacxin.component').then(
            (m) => m.LoaivacxinComponent
          ),
      },
      {
        path: 'dottiem',
        loadComponent: () =>
          import('./pages/dottiem/dottiem.component').then(
            (m) => m.DotTiemComponent
          ),
      },
      {
        path: 'hosotiemchung',
        loadComponent: () =>
          import('./pages/hoso-tiemchung/hoso-tiemchung.component').then(
            (m) => m.HosoTiemchungComponent
          ),
      },
      {
        path: 'canboyte',
        loadComponent: () =>
          import('./pages/canboyte/canboyte.component').then(
            (m) => m.CanboyteComponent
          ),
      },
      {
        path: 'nguoidan',
        loadComponent: () =>
          import('./pages/nguoidan/nguoidan.component').then(
            (m) => m.NguoidanComponent
          ),
      },
      {
        path: 'taikhoan',
        loadComponent: () =>
          import('./pages/taikhoan/taikhoan.component').then(
            (m) => m.TaikhoanComponent
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
