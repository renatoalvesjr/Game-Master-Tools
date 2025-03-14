import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {UtilsService} from '../../Services/utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

interface SystemNavList {
  name: string;
  route: string;
  icon: string;
  iconType: string;
  active: boolean;
}

// noinspection ExceptionCaughtLocallyJS
@Component({
  selector: 'app-Navigation',
  templateUrl: './Navigation.component.html',
  styleUrls: ['./Navigation.component.scss'],
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink, TranslateModule]
})
export class NavigationComponent implements OnInit {
  router = inject(Router);
  campaignService = inject(CampaignService);
  utils = inject(UtilsService)

  campaigns!: Campaign[];


  navList: SystemNavList[] = [
    {
      name: 'nav.navigation.campaign-management',
      route: 'campaign-management',
      icon: 'menu_book',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'nav.navigation.item-vault',
      route: 'items',
      icon: 'swords',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'nav.navigation.systems',
      route: 'systems',
      icon: 'shelves',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'nav.navigation.sound',
      route: 'sound',
      icon: 'music_cast',
      iconType: 'material-symbols-outlined',
      active: false,
    },
  ];

  constructor(private translate: TranslateService) {
    this.translate.use(this.translate.currentLang)
  }

  async ngOnInit() {
    this.campaignService.campaigns.subscribe(campaigns => {
      this.campaigns = campaigns;
      this.campaigns.sort((a, b) => b.campaignUpdateDate.localeCompare(a.campaignUpdateDate));
      this.campaigns = this.campaigns.slice(0, 4);
    });
  }
}
