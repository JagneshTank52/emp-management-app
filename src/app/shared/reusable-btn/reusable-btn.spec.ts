import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableBtn } from './reusable-btn';

describe('ReusableBtn', () => {
  let component: ReusableBtn;
  let fixture: ComponentFixture<ReusableBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
