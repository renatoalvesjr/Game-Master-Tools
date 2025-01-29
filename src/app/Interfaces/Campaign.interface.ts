import { Page } from './Page.interface';

export interface Campaign {
  campaignId: string;
  campaignName: string;
  campaignCreationDate: string;
  campaignUpdateDate: string;
  campaignDescription: string;
  campaignPages: Page[];
  campaignImageUrl: string;
  campaignSystemId: string; // Only for itens and creatures
  campaignIndex: number;
  active: boolean;
}
