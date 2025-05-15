import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HosoTiemchungComponent } from './hoso-tiemchung.component';

describe('HosoTiemchungComponent', () => {
  let component: HosoTiemchungComponent;
  let fixture: ComponentFixture<HosoTiemchungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HosoTiemchungComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HosoTiemchungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
