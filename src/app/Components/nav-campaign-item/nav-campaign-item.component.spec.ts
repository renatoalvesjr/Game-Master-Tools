import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavCampaignItemComponent } from './nav-campaign-item.component';

describe('NavCampaignItemComponent', () => {
  let component: NavCampaignItemComponent;
  let fixture: ComponentFixture<NavCampaignItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavCampaignItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavCampaignItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
