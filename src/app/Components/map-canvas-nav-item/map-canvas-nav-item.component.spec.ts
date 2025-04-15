import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCanvasNavItemComponent } from './map-canvas-nav-item.component';

describe('MapCanvasNavItemComponent', () => {
  let component: MapCanvasNavItemComponent;
  let fixture: ComponentFixture<MapCanvasNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapCanvasNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapCanvasNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
