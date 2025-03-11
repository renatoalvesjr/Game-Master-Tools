import {Component, inject, Input} from '@angular/core';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {FormatDatePipe} from '../../../Pipe/format-date.pipe';
import {Router} from '@angular/router';

@Component({
  selector: 'app-campaign-card',
  imports: [
    FormatDatePipe,
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss'
})
export class CampaignCardComponent {
  router: Router = inject(Router);

  @Input() campaign!: Campaign;

  async goTo(campaignId: string) {
    await this.router.navigate(['/campaign/:campaignId', {campaignId: campaignId}]);
  }

  constructor() {
  }
}
