import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Types/Campaign.type';
import {UtilsService} from '../../Services/utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SvgIconComponent} from 'angular-svg-icon';
import {NavMainMenuComponent} from '../../Components/nav-main-menu-item/nav-main-menu.component';
import {SystemNavList} from '../../Types/SystemNavList.type';
import {NavCampaignItemComponent} from '../../Components/nav-campaign-item/nav-campaign-item.component';

// noinspection ExceptionCaughtLocallyJS
@Component({
  selector: 'app-Navigation',
  templateUrl: './Navigation.component.html',
  styleUrls: ['./Navigation.component.scss'],
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink, TranslateModule, SvgIconComponent, NavMainMenuComponent, NavCampaignItemComponent]
})
export class NavigationComponent implements OnInit {
  router = inject(Router);
  campaignService = inject(CampaignService);
  utils = inject(UtilsService)

  campaigns!: Campaign[];


  superiorNavList: SystemNavList[] = [
    {
      name: 'nav.navigation.campaign-management',
      route: 'campaign-management',
      icon: 'menu_book',
      active: false,
    },
    {
      name: 'nav.navigation.item-vault',
      route: 'items',
      icon: 'swords',
      active: false,
    },
    {
      name: 'nav.navigation.systems',
      route: 'systems',
      icon: 'shelves',
      active: false,
    },
    {
      name: 'nav.navigation.sound',
      route: 'sound',
      icon: 'music_cast',
      active: false,
    },
  ];

  bottomNavList: SystemNavList[] = [
    {
      name: '',
      route: 'settings',
      icon: 'settings',
      active: false,
    },
    {
      name: '',
      route: '/',
      icon: 'home',
      active: false,
    }
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
