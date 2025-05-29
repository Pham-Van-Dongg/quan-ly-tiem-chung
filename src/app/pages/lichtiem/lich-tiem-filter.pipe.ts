import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'LichTiemFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
})
export class LichTiemFilter implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();
    return danhSach.filter((lt) => {
      const hoTen = lt.maNdNavigation?.hoTen?.toLowerCase() || '';

      return hoTen.includes(tuKhoa);
    });
  }
}
