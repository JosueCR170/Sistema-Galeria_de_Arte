import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArtworkComponent } from './view-artwork.component';

describe('ViewArtworkComponent', () => {
  let component: ViewArtworkComponent;
  let fixture: ComponentFixture<ViewArtworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewArtworkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewArtworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
