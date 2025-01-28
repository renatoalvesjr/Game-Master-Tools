import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CampaingSelectorService {
  campaignId: string = '';

  selectCampaign(campaignId: string) {
    this.campaignId = campaignId;
  }

  loadCampaign(): string {
    return this.campaignId;
  }

  constructor() {}
}
