import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotTiemFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
})
export class DotTiemFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();

    return danhSach.filter(
      (md) =>
        md.diaDiem != null &&
        md.diaDiem.toString().toLowerCase().includes(tuKhoa)
    );
  }
}
