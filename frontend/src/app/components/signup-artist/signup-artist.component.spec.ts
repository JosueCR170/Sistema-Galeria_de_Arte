import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupArtistComponent } from './signup-artist.component';

describe('SignupArtistComponent', () => {
  let component: SignupArtistComponent;
  let fixture: ComponentFixture<SignupArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupArtistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
