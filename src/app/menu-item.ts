export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Trang chủ', icon: 'home', route: '/home' },
  { label: 'Danh sách bé', icon: 'people', route: '/danhsachbe' },
  { label: 'Loại tiêm chủng', icon: 'history', route: '/loaitiemchung' },
  { label: 'Lịch tiêm', icon: 'bookmark', route: '/lichtiem' },
  { label: 'Loại vắc xin', icon: 'groups', route: '/loaivacxin' },
];
