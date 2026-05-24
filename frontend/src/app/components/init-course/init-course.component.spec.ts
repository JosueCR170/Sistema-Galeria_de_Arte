import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitCourseComponent } from './init-course.component';

describe('InitCourseComponent', () => {
  let component: InitCourseComponent;
  let fixture: ComponentFixture<InitCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InitCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
