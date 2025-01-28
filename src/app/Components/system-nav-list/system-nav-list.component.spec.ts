import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemNavListComponent } from './system-nav-list.component';

describe('SystemNavListComponent', () => {
  let component: SystemNavListComponent;
  let fixture: ComponentFixture<SystemNavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemNavListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
