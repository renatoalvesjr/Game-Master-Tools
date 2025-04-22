import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteNavItemComponent } from './note-nav-item.component';

describe('NoteNavItemComponent', () => {
  let component: NoteNavItemComponent;
  let fixture: ComponentFixture<NoteNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
