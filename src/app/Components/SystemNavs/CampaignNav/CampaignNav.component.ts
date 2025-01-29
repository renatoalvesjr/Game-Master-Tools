import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { CampaingSelectorService } from '../../../Services/campaing-selector.service';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../Interfaces/Campaign.interface';
import { CampaignService } from '../../../Services/campaign.service';
import { NoteEditorComponent } from '../../Editor/Editor.component';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  standalone: true,
  imports: [NoteEditorComponent],
})
export class CampaignNavComponent implements OnInit {
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);

  campaignId!: string;
  campaign!: Campaign;

  constructor() {
    this.route.params.subscribe((params) => {
      this.campaignId = params['campaignId'];
      this.campaign = this.campaignService.getCampaignById(this.campaignId);
    });
  }

  getCampaign(id: string) {
    this.campaign = this.campaignService.getCampaignById(id);
  }

  ngOnInit() {}
}
