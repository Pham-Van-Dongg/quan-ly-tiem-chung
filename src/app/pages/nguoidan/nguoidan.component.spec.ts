import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NguoidanComponent } from './nguoidan.component';

describe('NguoidanComponent', () => {
  let component: NguoidanComponent;
  let fixture: ComponentFixture<NguoidanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NguoidanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NguoidanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
