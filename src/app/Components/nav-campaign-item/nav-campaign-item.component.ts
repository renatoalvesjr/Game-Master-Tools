import {Component, Input} from '@angular/core';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-nav-campaign-item',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-campaign-item.component.html',
  styleUrl: './nav-campaign-item.component.scss'
})
export class NavCampaignItemComponent {

  @Input() item: Campaign | null = null;
}
