import {inject, Injectable} from '@angular/core';
import {CampaignService} from './campaign.service';
import {WindowRef} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  campaignService: CampaignService = inject(CampaignService);
  window = inject(WindowRef).getWindow();
  constructor() { }
  async loadConfig(){
    await this.campaignService.loadAllCampaigns();
  }
}
