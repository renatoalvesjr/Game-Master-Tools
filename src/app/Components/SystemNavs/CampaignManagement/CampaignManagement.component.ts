import {Component, inject, OnInit} from '@angular/core';
import {CampaignCardComponent} from './campaign-card/campaign-card.component';
import {CampaignService} from '../../../Services/campaign.service';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {PButtonComponent} from '../../Buttons/p-button/p-button.component';
import {FormatDatePipe} from '../../../Pipe/format-date.pipe';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-CampaignManagement',
  templateUrl: './CampaignManagement.component.html',
  styleUrls: ['./CampaignManagement.component.css'],
  imports: [
    CampaignCardComponent,
    RouterLink,
    PButtonComponent,
    FormatDatePipe,
    FormsModule
  ],
  standalone: true
})
export class CampaignManagementComponent implements OnInit {
  campaignService: CampaignService = inject(CampaignService);
  campaignSelected!: Campaign | null;
  campaigns!: Campaign[];
  array: number[] = [];
  dangerMode: boolean = false;

  async ngOnInit() {
    await this.loadCampaign();
  }

  async loadCampaign() {
    await this.campaignService.loadCampaigns();
    this.campaigns = this.campaignService.campaignList;
  }

  selectCampaign(campaign: Campaign) {
    this.dangerMode = false;
    this.campaignSelected = campaign;
  }

  async updateCampaign(campaign: Campaign) {
    await this.campaignService.updateCampaign(campaign);
  }

  async deleteCampaign(campaignId: string) {
    this.campaignSelected = null
    await this.campaignService.deleteCampaign(campaignId);
    await this.loadCampaign();
  }
}
