import {Component, inject, OnInit} from '@angular/core';
import {MButtonComponent} from '../Buttons/m-button/m-button.component';
import {CommonModule} from '@angular/common';
import {NoteEditorComponent} from '../Editor/Editor.component';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {CampaignNavComponent} from '../SystemNavs/CampaignNav/CampaignNav.component';
import {ItemsNavComponent} from '../SystemNavs/ItemsNav/ItemsNav.component';
import {SoundNavComponent} from '../SystemNavs/SoundNav/SoundNav.component';
import {SystemNavComponent} from '../SystemNavs/SystemNav/SystemNav.component';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {DividerComponent} from '../divider/divider.component';
import {WindowRef} from '../../Services/window.service';

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
  windowRef = inject(WindowRef);

  private window: any;


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

  constructor() {
    this.window = this.windowRef.nativeWindow;
  }

  ngOnInit() {
  }


  async openFile() {
    const path = this.window.electronAPI.openFile();

    this.readFileContent(await path).then(r => {
    });
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
