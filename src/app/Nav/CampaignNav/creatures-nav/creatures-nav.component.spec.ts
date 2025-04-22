import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaturesNavComponent } from './creatures-nav.component';

describe('CreaturesNavComponent', () => {
  let component: CreaturesNavComponent;
  let fixture: ComponentFixture<CreaturesNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaturesNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaturesNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
