import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {DividerComponent} from '../divider/divider.component';
import {UtilsService} from '../../Services/utils.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink, DividerComponent]
})
export class NavigationComponent implements OnInit {
  router = inject(Router);
  campaignService = inject(CampaignService);
  utils = inject(UtilsService)

  campaignList!: Observable<Campaign[]>;


  navList: SystemNavList[] = [
    {
      name: 'Campaigns Managment',
      route: 'campaign-management',
      icon: 'menu_book',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'Item Vault',
      route: 'items',
      icon: 'swords',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'Systems',
      route: 'systems',
      icon: 'shelves',
      iconType: 'material-symbols-outlined',
      active: false,
    },
    {
      name: 'Sound',
      route: 'sound',
      icon: 'music_cast',
      iconType: 'material-symbols-outlined',
      active: false,
    },
  ];

  constructor() {
  }


  async ngOnInit() {
    this.campaignList = (await this.campaignService.loadCampaigns()).pipe(
      map(campaigns => campaigns.slice(0, 2))
    );
  }

  async openFile() {
    // const load: CampaignDTO = {
    //   filePath: 'Campaign/Notes/',
    //   fileName: '1.json',
    //   content: ''
    // }
    // const returned = this.window.electronAPI.openFile(load);
    // returned.then((value: any) => {console.log(JSON.parse(value.content) as Campaign)});
    await this.campaignService.loadCampaigns()
  }
}
