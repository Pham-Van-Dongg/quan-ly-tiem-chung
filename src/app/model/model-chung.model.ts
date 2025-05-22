export interface CanBoYte {
  maCb: number;
  hoTen: string;
  soDienThoai: string;
  chucVu: string;
  donViCongTac: string;
  lichTiems?: LichTiem[];
}

export interface LichTiem {
  maLichTiem: number;
  maNd: number;
  maVac: number;
  maDot: number;
  maCb: number;
  ngayTiem: DateObject;
  muiThu: number;
  trangThai: string;
  maCbNavigation?: string;
  maDotNavigation?: DotTiem;
  maNdNavigation?: NguoiDung;
  maVacNavigation?: Vaccine;
}

export interface DateObject {
  year: number;
  month: number;
  day: number;
  dayOfWeek?: number;
  dayOfYear?: number;
  dayNumber?: number;
}

export interface DotTiem {
  maDot: number;
  ngayBatDau: DateObject;
  ngayKetThuc: DateObject;
  diaDiem: string;
  lichTiems?: string[];
}

export interface NguoiDung {
  maNd: number;
  hoTen: string;
  ngaySinh: DateObject;
  gioiTinh: string;
  cmndCccd: string;
  diaChi: string;
  soDienThoai: string;
  lichTiems?: string[];
  taiKhoans?: TaiKhoan[];
}

export interface TaiKhoan {
  maTk: number;
  tenDangNhap: string;
  matKhau: string;
  loaiTaiKhoan: string;
  maNd: number;
  maNdNavigation?: string;
}

export interface Vaccine {
  maVac: number;
  tenVac: string;
  hangSanXuat: string;
  soMui: number;
  thoiGianGiuaMui: number;
  lichTiems?: string[];
}
