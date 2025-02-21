import {inject, Injectable} from '@angular/core';
import {CampaignService} from './campaign.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  campaignService: CampaignService = inject(CampaignService);
  constructor() { }
  async loadConfig(){
    await this.campaignService.loadAllCampaigns();
  }
}
