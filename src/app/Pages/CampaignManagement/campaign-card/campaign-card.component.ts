import {Component, inject, Input} from '@angular/core';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {FormatDatePipe} from '../../../Pipe/format-date.pipe';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-campaign-card',
  imports: [
    FormatDatePipe, TranslateModule, SvgIconComponent
  ],
  templateUrl: './campaign-card.component.html',
  styleUrl: './campaign-card.component.scss'
})
export class CampaignCardComponent {
  router: Router = inject(Router);

  @Input() campaign!: Campaign;

  hover: boolean = false;

  async goTo(campaignId: string) {
    await this.router.navigate(['/campaign/:campaignId', {campaignId: campaignId}]);
  }

  constructor(private translate: TranslateService) {
    this.translate.use(this.translate.currentLang)
  }
}
