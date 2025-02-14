import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {CampaignService} from '../../../Services/campaign.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';
import {MatMenuModule} from '@angular/material/menu';
import {DividerComponent} from '../../divider/divider.component';
import {UtilsService} from '../../../Services/utils.service';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  standalone: true,
  imports: [RouterOutlet, MatMenuModule, DividerComponent],
})
export class CampaignNavComponent implements OnInit {
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  utils = inject(UtilsService);

  pagesHidden = false;
  mapsHidden = false;
  itemsHidden = false;
  creaturesHidden = false;
  hiddenDescription = false;

  campaignId!: string;
  campaign!: Campaign;
  pages!: Page[];

  constructor() {
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.campaignId = params['campaignId'];
      this.campaign = await this.campaignService.getCampaignById(this.campaignId);
      console.log(this.campaign);
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
    if (this.route.snapshot.paramMap.get('noteId')) {
      this.router.navigate(['page', pageId, 'note', noteId], {
        relativeTo: this.route.parent,
        onSameUrlNavigation: 'reload'
      },).then();
    }
    this.router.navigate(['page', pageId, 'note', noteId], {
      relativeTo: this.route,
      onSameUrlNavigation: 'reload'
    }).then();
  }

  addNote(pageId: string) {
    const note: Note = {
      noteId: this.utils.getUUID(),
      noteTitle: 'New Note',
      noteContent: '',
      noteIndex: 0,
      noteColor: '#FFFFFF',
      noteCreationDate: this.utils.getTimeNow(),
      noteUpdateDate: this.utils.getTimeNow(),
    }
    const campaign = this.campaign;
    campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes.push(note);
    this.campaignService.updateCampaign(campaign).then();
  }

  toggleEditable(noteId: string) {
    const noteElement = document.getElementById('note-' + noteId);
    if (!noteElement) {
      return;
    }
    noteElement.contentEditable = 'true';
    noteElement.focus();
    document.execCommand('selectAll', false);

    const disableContentEditable = () => {
      noteElement.contentEditable = 'false';
      noteElement.removeEventListener('blur', disableContentEditable);
      noteElement.removeEventListener('keydown', disableContentEditable);

      const updatedTitle = noteElement.innerText.trim();
      this.campaign.campaignPages.forEach((page: Page) => {
        page.pageNotes.forEach((note: Note) => {
          if (note.noteId === noteId) {
            note.noteTitle = updatedTitle;
            note.noteUpdateDate = this.utils.getTimeNow();
          }
        })
      });
      this.campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(this.campaign).then();
    }

    noteElement.addEventListener('blur', disableContentEditable);
  }


  deleteNote(noteId: string, pageId: string) {
    const campaign = this.campaign;
    console.log('deleting note: ', noteId);
    campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes = campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes.filter((note: Note) => note.noteId !== noteId);
    this.campaignService.updateCampaign(campaign).then();
  }
}
