import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TaiKhoanFilter',
  standalone: true,
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
