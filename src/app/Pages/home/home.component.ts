// noinspection JSUnusedGlobalSymbols

import {Component, inject, OnInit} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {SvgIconComponent} from 'angular-svg-icon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, MatTooltipModule, SvgIconComponent, TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  campaignService = inject(CampaignService);
  campaignList!: Campaign[];

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['pt', 'en']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  changeLanguage(language: string){
    this.translate.use(language);
  }

  async ngOnInit() {
    this.campaignService.campaigns.subscribe((campaigns: Campaign[]) => {
      this.campaignList = campaigns;
    });

  }

}
