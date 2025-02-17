import {Component, inject, OnInit} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {map} from 'rxjs/operators';

@Component({
    selector: 'app-home',
  imports: [
    RouterLink, MatTooltipModule, AsyncPipe
  ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  campaignService = inject(CampaignService);
  campaignList!: Observable<Campaign[]>;

  constructor() {
  }

  async ngOnInit() {
    this.campaignList = (await this.campaignService.loadCampaigns()).pipe(
      map(campaigns => campaigns.slice(0, 5))
    );
  }

}
