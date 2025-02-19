import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {CampaignService} from '../../../Services/campaign.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';
import {MatMenuModule} from '@angular/material/menu';
import {DividerComponent} from '../../divider/divider.component';
import {UtilsService} from '../../../Services/utils.service';
import {NoteEditorComponent} from '../../../Pages/Editor/Editor.component';

@Component({
  selector: 'app-CampaignNav',
  templateUrl: './CampaignNav.component.html',
  styleUrls: ['./CampaignNav.component.scss'],
  imports: [MatMenuModule, DividerComponent, NoteEditorComponent]
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
      // this.pages = this.campaign.campaignPages;
    });
  }

  goToNote(pageId: string, noteId: string) {
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
    // campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes.push(note);
    this.campaignService.updateCampaign(campaign).then();
  }

  toggleNoteEditable(noteId: string) {
    const noteElement = document.getElementById('note-' + noteId);
    if (!noteElement) {
      return;
    }
    noteElement.contentEditable = 'true';
    noteElement.focus();

    const disableContentEditable = () => {
      noteElement.contentEditable = 'false';
      noteElement.removeEventListener('blur', disableContentEditable);
      noteElement.removeEventListener('keydown', disableContentEditable);

      const updatedTitle = noteElement.innerText.trim();
      // this.campaign.campaignPages.forEach((page: Page) => {
      //   page.pageNotes.forEach((note: Note) => {
      //     if (note.noteId === noteId) {
      //       note.noteTitle = updatedTitle;
      //       note.noteUpdateDate = this.utils.getTimeNow();
      //     }
      //   })
      // });
      this.campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(this.campaign).then();
    }

    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        evt.preventDefault();
        noteElement.blur();
      }
    }

    noteElement.addEventListener('blur', disableContentEditable);
    noteElement.addEventListener('keydown', onKeyDown)
  }

  togglePageEditable(pageId: string) {
    const pageElement = document.getElementById('page-' + pageId);
    if (!pageElement) {
      return;
    }
    pageElement.contentEditable = 'true';
    pageElement.focus();
    const range = document.createRange();
    range.selectNodeContents(pageElement);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);

    const disableContentEditable = () => {
      pageElement.contentEditable = 'false';
      pageElement.removeEventListener('blur', disableContentEditable);
      pageElement.removeEventListener('keydown', disableContentEditable);

      const updatedTitle = pageElement.innerText.trim();
      // this.campaign.campaignPages.forEach((page: Page) => {
      //   if (page.pageId === pageId) {
      //     page.pageTitle = updatedTitle;
      //   }
      // });
      this.campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(this.campaign).then();
    }

    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Enter' || evt.key === 'Escape') {
        evt.preventDefault();
        pageElement.blur();
      }
    }

    pageElement.addEventListener('blur', disableContentEditable)
    pageElement.addEventListener('keydown', onKeyDown)
  }

  deleteNote(noteId: string, pageId: string) {
    const campaign = this.campaign;
    // campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes = campaign.campaignPages.find((page: Page) => page.pageId === pageId)!.pageNotes.filter((note: Note) => note.noteId !== noteId);
    this.campaignService.updateCampaign(campaign).then();
  }

  deletePage(pageId: string) {
    const campaign = this.campaign;
    // this.campaign.campaignPages.find((page: Page) => page.pageId === pageId)?.pageNotes.forEach((note: Note) => {
    //   this.deleteNote(note.noteId, pageId);
    // });
    // this.campaign.campaignPages = this.campaign.campaignPages.filter((page: Page) => page.pageId !== pageId);
    this.campaignService.updateCampaign(campaign).then();
    // this.pages = this.campaign.campaignPages;
  }

  addPage() {
    const page: Page = {
      pageId: this.utils.getUUID(),
      pageIndex: 0,
      pageTitle: 'New Page',
      pageNotes: [],
      pageCreationDate: this.utils.getTimeNow(),
      pageActive: true,
    }
    // this.campaign.campaignPages.push(page);
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
