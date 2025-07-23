import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableNavBtn } from './reusable-nav-btn';

describe('ReusableNavBtn', () => {
  let component: ReusableNavBtn;
  let fixture: ComponentFixture<ReusableNavBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableNavBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableNavBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
