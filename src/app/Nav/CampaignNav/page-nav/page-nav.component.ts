import {AfterViewInit, Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {CampaignService} from '../../../Services/campaign.service';
import {PageService} from '../../../Services/page.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../Services/utils.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';
import {relativeFrom} from '@angular/compiler-cli';
import {subscribe} from 'node:diagnostics_channel';
import {log} from 'node:util';
import {NoteNavComponent} from './note-nav/note-nav.component';
import {NoteService} from '../../../Services/note.service';
import {createInjectableType} from '@angular/compiler';

@Component({
  selector: 'app-page-nav',
  imports: [
    MatMenuModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NoteNavComponent
  ],
  templateUrl: './page-nav.component.html',
  styleUrl: './page-nav.component.scss'
})
export class PageNavComponent implements OnInit {
  @Input() campaign!: Campaign;
  campaignService = inject(CampaignService);
  pageService: PageService = inject(PageService);
  noteService: NoteService = inject(NoteService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  utils = inject(UtilsService);

  @ViewChild(NoteNavComponent) noteNavComponent: NoteNavComponent | undefined;

  pagesHidden = false;

  pages!: Page[] | null;

  constructor() {
  }

  async ngOnInit() {
    await this.updatePages()
  }

  async updatePages() {
    this.route.params.subscribe(async (params: any) => {
        this.campaign = await this.campaignService.getCampaignById(params['campaignId']);
        this.pages = await this.pageService.loadAllpages(this.campaign.campaignId);
      }
    )
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

  async addNote(pageId: string) {
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
    await this.noteService.addNote(this.campaign.campaignId, pageId, note);
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();

    const campaign = this.campaign;
    await this.campaignService.updateCampaign(campaign).then(async () => {
      await this.updatePages()
    });
    if(this.noteNavComponent) await this.noteNavComponent.loadAllNotes();
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

  togglePageEditable(page: Page) {
    const pageElement = document.getElementById('page-' + page.pageId);
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
      const updatedPage: Page = {
        ...page,
        pageTitle: updatedTitle,
      }
      this.pageService.updatePage(this.campaign.campaignId, updatedPage).then(async () => {
        await this.updatePages();
      });
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
    this.pageService.deletePage(this.campaign.campaignId, pageId).then(async () => {
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    });
    // this.campaign.campaignPages.find((page: Page) => page.pageId === pageId)?.pageNotes.forEach((note: Note) => {
    //   this.deleteNote(note.noteId, pageId);
    // });
    // this.campaign.campaignPages = this.campaign.campaignPages.filter((page: Page) => page.pageId !== pageId);
    // this.pages = this.campaign.campaignPages;
  }

  async addPage() {
    const page: Page = {
      pageId: this.utils.getUUID(),
      pageIndex: 0,
      pageTitle: 'New Page',
      pageCreationDate: this.utils.getTimeNow(),
      pageActive: true,
      pageColor: 'white'
    }
    this.pageService.createPage(page, this.campaign.campaignId).then(async () =>
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    );
    // this.campaign.campaignPages.push(page);
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }

  changeColor(page: Page, color: string) {
    page.pageColor = color;
    this.pageService.updatePage(this.campaign.campaignId, page).then(async () =>
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    );
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
