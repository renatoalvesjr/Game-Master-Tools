import { Injectable } from '@angular/core';
import { Campaign } from '../Interfaces/Campaign.interface';
import campaignList from '../Tests/campaignList.json';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  campaignList = JSON.parse(JSON.stringify(campaignList)) as Campaign[];
  getCampaigns(): Campaign[] {
    return campaignList;
  }
  getCampaignById(campaignId: string): Campaign {
    return campaignList.find(
      (campaign) => campaign.campaignId === campaignId
    ) as Campaign;
  }

  updateCampaignnotes() {}
}
