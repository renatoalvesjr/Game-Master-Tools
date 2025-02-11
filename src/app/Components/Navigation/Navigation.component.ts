import { Component, inject, OnInit } from '@angular/core';
import { MButtonComponent } from '../Buttons/m-button/m-button.component';
import { CommonModule } from '@angular/common';
import { NoteEditorComponent } from '../Editor/Editor.component';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CampaignNavComponent } from '../SystemNavs/CampaignNav/CampaignNav.component';
import { ItemsNavComponent } from '../SystemNavs/ItemsNav/ItemsNav.component';
import { SoundNavComponent } from '../SystemNavs/SoundNav/SoundNav.component';
import { SystemNavComponent } from '../SystemNavs/SystemNav/SystemNav.component';
import { CampaignService } from '../../Services/campaign.service';
import { Campaign } from '../../Interfaces/Campaign.interface';
import {DividerComponent} from '../divider/divider.component';

interface SystemNavList {
  name: string;
  route: string;
  icon: string;
  iconType: string;
  active: boolean;
}

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

  campaignList: Campaign[] = this.campaignService.getCampaigns();

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
    this.router.navigate([system.route]);
  }

  toggleSubmenu() {
    console.log('toggleSubmenu');
    console.log('from ' + this.subHidden);
    this.subHidden = !this.subHidden;
    console.log('to ' + this.subHidden);
  }
  constructor() {}

  ngOnInit() {}
}
