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
  maCbNavigation?: CanBoYte | null;
  maDotNavigation?: DotTiem | null;
  maNdNavigation?: NguoiDung | null;
  maVacNavigation?: Vaccine | null;
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
  maDot: null;
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
  loaiTaiKhoan: number;
  maNd: number | null;
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
