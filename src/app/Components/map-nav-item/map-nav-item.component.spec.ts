import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapNavItemComponent } from './map-nav-item.component';

describe('MapNavItemComponent', () => {
  let component: MapNavItemComponent;
  let fixture: ComponentFixture<MapNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
