import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canBoFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
})
export class CanBoFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();
    return danhSach.filter(
      (cb) =>
        cb.hoTen.toLowerCase().includes(tuKhoa) ||
        cb.soDienThoai.toLowerCase().includes(tuKhoa)
    );
  }
}
