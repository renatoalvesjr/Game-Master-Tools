import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {CampaignService} from '../../../Services/campaign.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class CampaignNavComponent implements OnInit {
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  pagesHidden = false;
  mapsHidden = false;
  itemsHidden = false;
  creaturesHidden = false;

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

  goToNote(pageId: string, noteId: string) {
    const noteElements = document.querySelectorAll('[id^="note-"]');
    noteElements.forEach((element) => {
      element.classList.remove('bg-[#BFCFE2]');
    });

    const noteElement = document.getElementById('note-' + noteId);
    if (noteElement) {
      noteElement.classList.add('bg-[#BFCFE2]');
    }
    if(this.route.snapshot.paramMap.get('noteId')) {
      this.router.navigate(['page', pageId, 'note', noteId], {relativeTo: this.route.parent});
    }
    this.router.navigate(['page', pageId, 'note', noteId], {relativeTo: this.route});
  }

  getCampaign(id: string) {
    this.campaign = this.campaignService.getCampaignById(id);
  }

  ngOnInit() {
  }
}
