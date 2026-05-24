import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieCourseComponent } from './categorie-course.component';

describe('CategorieCourseComponent', () => {
  let component: CategorieCourseComponent;
  let fixture: ComponentFixture<CategorieCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorieCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
