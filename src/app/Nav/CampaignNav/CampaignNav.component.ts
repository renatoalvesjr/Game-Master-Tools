import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {CampaignService} from '../../Services/campaign.service';
import {Page} from '../../Interfaces/Page.interface';
import {Note} from '../../Interfaces/Note.interface';
import {MatMenuModule} from '@angular/material/menu';
import {DividerComponent} from '../../Components/divider/divider.component';
import {UtilsService} from '../../Services/utils.service';
import {NoteEditorComponent} from '../../Pages/Editor/Editor.component';
import {PageService} from '../../Services/page.service';
import {PageNavComponent} from './page-nav/page-nav.component';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  imports: [MatMenuModule, DividerComponent, NoteEditorComponent, PageNavComponent]
})
export class CampaignNavComponent implements OnInit {
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  utils = inject(UtilsService);

  mapsHidden = false;
  itemsHidden = false;
  creaturesHidden = false;
  hiddenDescription = false;

  campaignId!: string;
  campaign!: Campaign;
  campaignTitle: string = '';
  campaignDescription: string = '';

  constructor() {
  }

  async ngOnInit() {
    try {
      this.route.params.subscribe(async (params) => {
        this.campaignId = params['campaignId'];
        this.campaign = await this.campaignService.getCampaignById(this.campaignId);
        this.campaignTitle = this.campaign.campaignName || '';
        this.campaignDescription = this.campaign.campaignDescription || '';
      });
    }catch (e) {
      console.error('Error on ngOnInit:', e);
    }
  }


}
