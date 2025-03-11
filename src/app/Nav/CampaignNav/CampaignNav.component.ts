import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {CampaignService} from '../../Services/campaign.service';
import {Note} from '../../Interfaces/Note.interface';
import {MatMenuModule} from '@angular/material/menu';
import {DividerComponent} from '../../Components/divider/divider.component';
import {UtilsService} from '../../Services/utils.service';
import {NoteEditorComponent} from '../../Pages/Editor/Editor.component';
import {PageNavComponent} from './page-nav/page-nav.component';
import {NgIf} from '@angular/common';
import {NoteService} from '../../Services/note.service';
import {Page} from '../../Interfaces/Page.interface';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  imports: [MatMenuModule, DividerComponent, NoteEditorComponent, PageNavComponent, NgIf, SvgIconComponent]
})
export class CampaignNavComponent implements OnInit {
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  utils = inject(UtilsService);
  noteService = inject(NoteService);

  mapsHidden = false;
  itemsHidden = false;
  creaturesHidden = false;
  hiddenDescription = false;

  campaignId!: string;
  campaign!: Campaign;
  campaignTitle: string = '';
  campaignDescription: string = '';

  selectedNote: Note | undefined = undefined;
  selectedPage: Page | null = null;
  selectedCampaign: string | null = null;

  constructor() {
  }

  // In CampaignNavComponent
// In CampaignNavComponent


  async ngOnInit() {
    try {
      this.route.params.subscribe(async (params) => {
        this.campaignId = params['campaignId'];
        this.campaign = await this.campaignService.getCampaignById(this.campaignId);
        this.campaignTitle = this.campaign.campaignName || '';
        this.campaignDescription = this.campaign.campaignDescription || '';
      });
      this.noteService.selectedNote$.subscribe((pageNote) => {
        if (pageNote.note) {
          this.selectedNote = pageNote.note;
          this.selectedPage = pageNote.page;
          this.selectedCampaign = pageNote.campaignId;
        }
      });

    } catch (e) {
      console.error('Error on ngOnInit:', e);
    }
  }

  async goTo(campaignId: string) {
    await this.router.navigate(['/campaign-management/', {campaignId: campaignId}]);
  }


}
