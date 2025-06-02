import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TaiKhoanFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
})
export class TaiKhoanFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase();
    return danhSach.filter(
      (tk) =>
        tk.hoTen?.toLowerCase().includes(tuKhoa) ||
        tk.email?.toLowerCase().includes(tuKhoa)
    );
  }
}
