import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaAdministrationComponent } from './artista-administration.component';

describe('ArtistaAdministrationComponent', () => {
  let component: ArtistaAdministrationComponent;
  let fixture: ComponentFixture<ArtistaAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistaAdministrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistaAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
