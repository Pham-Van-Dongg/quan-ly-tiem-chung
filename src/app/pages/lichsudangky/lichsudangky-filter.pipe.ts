import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lichhsudangkyFilter',
  standalone: true,
})
export class LichSuDangKyFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();

    return danhSach.filter(
      (ls) =>
        ls.maVacNavigation?.tenVac &&
        ls.maVacNavigation.tenVac.toLowerCase().includes(tuKhoa)
    );
  }
}
