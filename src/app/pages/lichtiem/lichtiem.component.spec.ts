import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichtiemComponent } from './lichtiem.component';

describe('LichtiemComponent', () => {
  let component: LichtiemComponent;
  let fixture: ComponentFixture<LichtiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LichtiemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichtiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
