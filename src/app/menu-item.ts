import { routes } from './app.routes';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Lịch tiêm', icon: 'event_note', route: '/lichtiem' },
  { label: 'Loại vắc xin', icon: 'science', route: '/loaivacxin' },
  { label: 'Đợt tiêm', icon: 'calendar_month', route: '/dottiem' },
  { label: 'Cán bộ y tế', icon: 'event_note', route: '/canboyte' },
  { label: 'Người dân', icon: 'home', route: '/nguoidan' },
  { label: 'Tài khoản', icon: 'home', route: '/taikhoan' },
];
