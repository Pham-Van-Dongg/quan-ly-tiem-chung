declare var bootstrap: any;
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  Validator,
  Validators,
} from '@angular/forms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LichTiemService } from '../../services/lich-tiem.service';
import { CanBoYteService } from '../../services/can-bo.service';
import {
  LichTiem,
  DotTiem,
  CanBoYte,
  NguoiDung,
  Vaccine,
  DateObject,
} from '../../model/model-chung.model';

@Component({
  selector: 'app-lichtiem',
  standalone: true,
  imports: [],
  templateUrl: './lichtiem.component.html',
  styleUrl: './lichtiem.component.css',
})
export class LichTiemComponent {}
