import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavItemComponent } from './page-nav-item.component';

describe('PageNavItemComponent', () => {
  let component: PageNavItemComponent;
  let fixture: ComponentFixture<PageNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
