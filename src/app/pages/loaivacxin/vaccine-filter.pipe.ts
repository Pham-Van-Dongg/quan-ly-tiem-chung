import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'VaccineFilter',
  standalone: true, // Angular 15+ trở lên dùng standalone pipe
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
