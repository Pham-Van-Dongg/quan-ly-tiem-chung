import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanhsachbeComponent } from './danhsachbe.component';

describe('DanhsachbeComponent', () => {
  let component: DanhsachbeComponent;
  let fixture: ComponentFixture<DanhsachbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DanhsachbeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanhsachbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
