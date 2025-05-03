import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaitiemchungComponent } from './loaitiemchung.component';

describe('LoaitiemchungComponent', () => {
  let component: LoaitiemchungComponent;
  let fixture: ComponentFixture<LoaitiemchungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaitiemchungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaitiemchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
