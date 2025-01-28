export interface Campaign {
  campaignId: string;
  campaignName: string;
  campaignCreationDate: string;
  campaignUpdateDate: string;
  campaignContent: string[];
  campaignSystemId: string; // Only for itens and creatures
  campaignIndex: number;
}
