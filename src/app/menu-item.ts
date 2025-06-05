import { routes } from './app.routes';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Lịch tiêm', icon: 'event_note', route: '/lichtiem' }, // icon OK
  { label: 'Loại vắc xin', icon: 'vaccines', route: '/loaivacxin' }, // icon liên quan đến vắc xin
  { label: 'Đợt tiêm', icon: 'calendar_month', route: '/dottiem' }, // icon OK
  { label: 'Cán bộ y tế', icon: 'medical_services', route: '/canboyte' }, // biểu tượng dịch vụ y tế
  { label: 'Người dân', icon: 'groups', route: '/nguoidan' }, // biểu tượng người dân, nhóm
  { label: 'Tài khoản', icon: 'account_circle', route: '/taikhoan' }, // biểu tượng tài khoản
  { label: 'Cập nhật thông tin', icon: 'edit', route: '/capnhatthongtin' }, // biểu tượng chỉnh sửa
  { label: 'Lịch sử đăng ký', icon: 'history', route: '/lichsudangky' }, // biểu tượng lịch sử
  { label: 'Chatbot', icon: 'chat', route: '/chatbot' },
];
