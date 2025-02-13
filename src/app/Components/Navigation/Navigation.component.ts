import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet,} from '@angular/router';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {DividerComponent} from '../divider/divider.component';
import {WindowRef} from '../../Services/window.service';
import {UtilsService} from '../../Services/utils.service';

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
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink, DividerComponent],
  standalone: true,
})
export class NavigationComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  campaignService = inject(CampaignService);
  windowRef = inject(WindowRef);

  private window: any;

  campaignList: Campaign[] = [];

  subHidden: boolean = false;

  system!: string;

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

  navigate(system: SystemNavList) {
    this.navList.forEach((nav) => (nav.active = false));
    system.active = true;
    this.router.navigate([system.route]).then();
  }

  toggleSubmenu() {
    console.log('toggleSubmenu');
    console.log('from ' + this.subHidden);
    this.subHidden = !this.subHidden;
    console.log('to ' + this.subHidden);
  }

  constructor() {
    this.window = this.windowRef.nativeWindow;
    this.campaignService.getCampaigns().then(campaigns => this.campaignList = campaigns);
  }

  ngOnInit() {
  }

  utils = inject(UtilsService)

  async openFile() {
    this.campaignService.testOpenFile();
  }

  async readFileContent(filePath: string) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const text = await response.text();

      console.log('file content:\n', text);
    } catch (error: any) {
      console.error(`Error loading file: ${error.message}`);
    }
  }
}
