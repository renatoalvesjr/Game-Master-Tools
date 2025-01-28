import { Component, inject, OnInit } from '@angular/core';
import { CampaingSelectorService } from '../../../Services/campaing-selector.service';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.css'],
  standalone: true,
})
export class CampaignNavComponent implements OnInit {
  campaignId!: string;
  campaignSelector = inject(CampaingSelectorService);
  constructor() {
    this.campaignId = this.campaignSelector.loadCampaign();
  }

  ngOnInit() {}
}
