// noinspection JSUnusedGlobalSymbols

import { Component, inject, OnInit } from '@angular/core';
import { CampaignService } from '../../Services/campaign.service';
import { Campaign } from '../../Types/Campaign.type';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SvgIconComponent } from 'angular-svg-icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PButtonComponent } from '../../Components/Buttons/p-button/p-button.component';
import { WindowRef } from '../../Services/window.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatTooltipModule,
    SvgIconComponent,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  campaignService = inject(CampaignService);
  window = inject(WindowRef).getWindow();
  campaignList!: Campaign[];

  constructor(private readonly translate: TranslateService) {
    this.translate.use(this.translate.currentLang);
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnInit() {
    this.campaignService.campaigns.subscribe((campaigns: Campaign[]) => {
      this.campaignList = campaigns;
    });
  }
}
