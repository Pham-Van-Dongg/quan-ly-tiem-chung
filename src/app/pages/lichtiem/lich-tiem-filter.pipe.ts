import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'LichTiemFilter',
  standalone: true,
})
export class LichTiemFilter implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!Array.isArray(danhSach)) return [];
    if (!tuKhoa) return danhSach;

    tuKhoa = tuKhoa.toLowerCase().trim();

    return danhSach.filter((lt) => {
      const hoTen = lt.maNdNavigation?.hoTen?.toLowerCase() || '';
      const tenVac = lt.maVacNavigation?.tenVac?.toLowerCase() || '';
      return hoTen.includes(tuKhoa) || tenVac.includes(tuKhoa);
    });
  }
}
