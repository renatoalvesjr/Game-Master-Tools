import {Component, Input} from '@angular/core';
import {Campaign} from '../../Types/Campaign.type';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-nav-campaign-item',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './nav-campaign-item.component.html',
  styleUrl: './nav-campaign-item.component.scss'
})
export class NavCampaignItemComponent {

  @Input() item: Campaign | null = null;
}
