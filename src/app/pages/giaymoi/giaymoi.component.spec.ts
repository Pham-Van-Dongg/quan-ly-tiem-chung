import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiaymoiComponent } from './giaymoi.component';

describe('GiaymoiComponent', () => {
  let component: GiaymoiComponent;
  let fixture: ComponentFixture<GiaymoiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiaymoiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiaymoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
