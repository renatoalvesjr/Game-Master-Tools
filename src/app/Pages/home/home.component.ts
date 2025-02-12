import {Component, inject} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  campaignService = inject(CampaignService);
  campaignList: Campaign[] = [];

  constructor() {
    this.campaignService.getCampaigns().then(campaigns => this.campaignList = campaigns);
    this.campaignService.getCampaigns().then(campaigns => {
      this.campaignList = campaigns.sort((a, b) => new Date(b.campaignUpdateDate).getTime() - new Date(a.campaignUpdateDate).getTime());
    });
  }
}
