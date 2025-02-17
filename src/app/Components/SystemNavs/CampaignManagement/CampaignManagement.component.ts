import {ChangeDetectionStrategy, Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {CampaignCardComponent} from './campaign-card/campaign-card.component';
import {CampaignService} from '../../../Services/campaign.service';
import {Observable} from 'rxjs';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {ScrollingModule} from '@angular/cdk/scrolling';


@Component({
  selector: 'app-CampaignManagement',
  templateUrl: './CampaignManagement.component.html',
  styleUrls: ['./CampaignManagement.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CampaignCardComponent,
    ScrollingModule
  ],
  standalone: true
})
export class CampaignManagementComponent implements OnInit {
  campaignService: CampaignService = inject(CampaignService);
  campaignList!: Observable<Campaign[]>;
  items!: Campaign[];

  async ngOnInit(){
    this.campaignList = await this.campaignService.loadCampaigns();
    this.campaignList.subscribe((campaigns) => {
      this.items = campaigns;
    })
    console.log(this.items)
  }
  constructor() { }


}
