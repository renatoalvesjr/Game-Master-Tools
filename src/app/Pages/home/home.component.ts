// noinspection JSUnusedGlobalSymbols

import {Component, inject, OnInit} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, MatTooltipModule, SvgIconComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  campaignService = inject(CampaignService);
  campaignList!: Campaign[];

  constructor() {
  }


  async ngOnInit() {
    this.campaignService.campaigns.subscribe((campaigns: Campaign[]) => {
      this.campaignList = campaigns;
    });
  }

}
