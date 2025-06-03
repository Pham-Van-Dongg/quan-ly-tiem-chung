import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapnhatthongtinComponent } from './capnhatthongtin.component';

describe('CapnhatthongtinComponent', () => {
  let component: CapnhatthongtinComponent;
  let fixture: ComponentFixture<CapnhatthongtinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapnhatthongtinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapnhatthongtinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
