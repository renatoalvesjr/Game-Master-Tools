import {Component, inject, OnInit} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
    selector: 'app-home',
    imports: [
        RouterLink, MatTooltipModule
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  campaignService = inject(CampaignService);
  campaignList: Campaign[] = [];

  constructor() {
  }

  async ngOnInit(){
    this.campaignList = await this.campaignService.loadCampaigns();
  }
}
