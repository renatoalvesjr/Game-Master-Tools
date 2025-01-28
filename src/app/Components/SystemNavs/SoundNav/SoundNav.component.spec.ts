/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SoundNavComponent } from './SoundNav.component';

describe('SoundNavComponent', () => {
  let component: SoundNavComponent;
  let fixture: ComponentFixture<SoundNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
