import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanboyteComponent } from './canboyte.component';

describe('CanboyteComponent', () => {
  let component: CanboyteComponent;
  let fixture: ComponentFixture<CanboyteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanboyteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanboyteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
