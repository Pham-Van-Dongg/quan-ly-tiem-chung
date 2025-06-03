import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichsudangkyComponent } from './lichsudangky.component';

describe('LichsudangkyComponent', () => {
  let component: LichsudangkyComponent;
  let fixture: ComponentFixture<LichsudangkyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LichsudangkyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichsudangkyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
