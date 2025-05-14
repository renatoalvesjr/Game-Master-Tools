export type Campaign = {
  campaignId: string;
  authorId?: string;
  campaignName: string;
  campaignCreationDate: string;
  campaignUpdateDate: string;
  campaignDescription: string;
  campaignImageUrl: string;
  campaignSystemName: string; // Only for itens and creatures
  campaignIndex: number;
  active: boolean;
}
