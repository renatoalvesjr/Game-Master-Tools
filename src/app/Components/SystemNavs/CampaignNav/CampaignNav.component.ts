import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { CampaingSelectorService } from '../../../Services/campaing-selector.service';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../Interfaces/Campaign.interface';
import { CampaignService } from '../../../Services/campaign.service';
import { NoteEditorComponent } from '../../Editor/Editor.component';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';

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

  pagesHidden = false;

  campaignId!: string;
  campaign!: Campaign;
  pages!: Page[];
  notes!: Note[];

  constructor() {
    this.route.params.subscribe((params) => {
      this.campaignId = params['campaignId'];
      this.campaign = this.campaignService.getCampaignById(this.campaignId);
      this.pages = this.campaign.campaignPages;

    });
  }

  getCampaign(id: string) {
    this.campaign = this.campaignService.getCampaignById(id);
  }

  ngOnInit() {}
}
