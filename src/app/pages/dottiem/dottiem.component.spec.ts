import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DottiemComponent } from './dottiem.component';

describe('DottiemComponent', () => {
  let component: DottiemComponent;
  let fixture: ComponentFixture<DottiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DottiemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DottiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
