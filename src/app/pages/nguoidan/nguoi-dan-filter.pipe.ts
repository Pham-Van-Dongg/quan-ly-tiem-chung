import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NguoiDanFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
})
export class NguoiDanFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();

    return danhSach.filter(
      (nd) => nd.hoTen != null && nd.hoTen.toLowerCase().includes(tuKhoa)
    );
  }
}
