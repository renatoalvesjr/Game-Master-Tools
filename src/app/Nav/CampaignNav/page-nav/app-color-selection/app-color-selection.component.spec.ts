import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppColorSelectionComponent } from './app-color-selection.component';

describe('AppColorSelectionComponent', () => {
  let component: AppColorSelectionComponent;
  let fixture: ComponentFixture<AppColorSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppColorSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppColorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
