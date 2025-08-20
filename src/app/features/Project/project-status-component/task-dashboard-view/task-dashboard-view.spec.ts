import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDashboardView } from './task-dashboard-view';

describe('TaskDashboardView', () => {
  let component: TaskDashboardView;
  let fixture: ComponentFixture<TaskDashboardView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDashboardView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDashboardView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
