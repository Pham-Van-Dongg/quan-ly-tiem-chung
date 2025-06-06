import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'VaccineFilter',
  standalone: true,
})
export class VaccineFilterPipe implements PipeTransform {
  transform(danhSach: any[], tuKhoa: string): any[] {
    if (!danhSach || !tuKhoa) return danhSach;
    tuKhoa = tuKhoa.toLowerCase().trim();

    return danhSach.filter(
      (vc) => vc.tenVac != null && vc.tenVac.toLowerCase().includes(tuKhoa)
    );
  }
}
