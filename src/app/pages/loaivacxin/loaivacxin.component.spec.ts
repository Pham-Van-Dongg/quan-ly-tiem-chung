import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaivacxinComponent } from './loaivacxin.component';

describe('LoaivacxinComponent', () => {
  let component: LoaivacxinComponent;
  let fixture: ComponentFixture<LoaivacxinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaivacxinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaivacxinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
