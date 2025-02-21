import {Component, inject, Input, OnInit} from '@angular/core';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {CampaignService} from '../../../Services/campaign.service';
import {PageService} from '../../../Services/page.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../Services/utils.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';

@Component({
  selector: 'app-page-nav',
  imports: [
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './page-nav.component.html',
  styleUrl: './page-nav.component.scss'
})
export class PageNavComponent implements OnInit {
  @Input() campaign!: Campaign;
  campaignService = inject(CampaignService);
  pageService: PageService = inject(PageService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  utils = inject(UtilsService);

  pagesHidden = false;

  campaignId!: string;
  pages!: Page[];

  constructor() {
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.campaignId = params['campaignId'];
      await this.pageService.loadAllpages(this.campaignId);
      this.pageService.pageList.subscribe(pageList => {
        this.pages = pageList;
        console.log(pageList);
      })
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
      active: true,
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
      pageCreationDate: this.utils.getTimeNow(),
      pageActive: true,
    }
    // this.campaign.campaignPages.push(page);
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
