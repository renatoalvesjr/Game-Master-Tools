import { Component, inject, OnInit } from '@angular/core';
import { MButtonComponent } from '../Buttons/m-button/m-button.component';
import { CommonModule } from '@angular/common';
import { NoteEditorComponent } from '../Editor/Editor.component';
import { SystemNavListComponent } from '../system-nav-list/system-nav-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignNavComponent } from '../SystemNavs/CampaignNav/CampaignNav.component';
import { ItemsNavComponent } from '../SystemNavs/ItemsNav/ItemsNav.component';
import { SoundNavComponent } from '../SystemNavs/SoundNav/SoundNav.component';
import { SystemNavComponent } from '../SystemNavs/SystemNav/SystemNav.component';

enum Systems {
  Campaigns,
  Items,
  Systems,
  Sound,
}

@Component({
  selector: 'app-Navigation',
  templateUrl: './Navigation.component.html',
  styleUrls: ['./Navigation.component.css'],
  imports: [
    CommonModule,
    MButtonComponent,
    NoteEditorComponent,
    SystemNavListComponent,
    CampaignNavComponent,
    ItemsNavComponent,
    SoundNavComponent,
    SystemNavComponent,
  ],
  standalone: true,
})
export class NavigationComponent implements OnInit {
  route = inject(ActivatedRoute);
  subHidden: boolean = false;
  system!: string;
  toggleSubmenu() {
    console.log('toggleSubmenu');
    console.log('from ' + this.subHidden);
    this.subHidden = !this.subHidden;
    console.log('to ' + this.subHidden);
  }
  constructor() {}

  ngOnInit() {}

  checkSystem(system?: string): void {
    if (system) {
      this.system = system;
    }
  }
}
