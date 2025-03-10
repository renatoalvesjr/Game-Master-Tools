import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import {Campaign} from '../../../Interfaces/Campaign.interface';
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import {CampaignService} from '../../../Services/campaign.service';
import {PageService} from '../../../Services/page.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../Services/utils.service';
import {Page} from '../../../Interfaces/Page.interface';
import {Note} from '../../../Interfaces/Note.interface';
import {NoteNavComponent} from './note-nav/note-nav.component';
import {NoteService} from '../../../Services/note.service';

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
    if (this.noteNavComponent) await this.noteNavComponent.loadAllNotes();
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

    const disableContentEditable = async () => {
      pageElement.contentEditable = 'false';
      pageElement.removeEventListener('blur', disableContentEditable);
      pageElement.removeEventListener('keydown', disableContentEditable);

      const updatedTitle = pageElement.innerText.trim();
      const updatedPage: Page = {
        ...page,
        pageTitle: updatedTitle,
      }
      await this.pageService.updatePage(this.campaign.campaignId, updatedPage)
      await this.updatePages();

      this.campaign.campaignUpdateDate = this.utils.getTimeNow();
      this.campaignService.updateCampaign(this.campaign).then();
    }

    const onKeyDown = async (evt: KeyboardEvent) => {
      if (evt.key === 'Enter') {
        await disableContentEditable();
      } else if (evt.key === 'Esc') {
        evt.preventDefault();
        return;
      }
    }

    pageElement.addEventListener('blur', disableContentEditable)
    pageElement.addEventListener('keydown', onKeyDown)
  }


  deletePage(pageId: string) {
    this.pageService.deletePage(this.campaign.campaignId, pageId).then(async () => {
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    });
  }

  async addPage() {
    const page: Page = {
      pageId: this.utils.getUUID(),
      pageIndex: 0,
      pageTitle: 'New Page',
      pageCreationDate: this.utils.getTimeNow(),
      pageActive: true,
      pageColor: 'red-500'
    }
    this.pageService.createPage(page, this.campaign.campaignId).then(async () =>
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    );
    // this.campaign.campaignPages.push(page);
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }

  changeColor(page: Page, color: string) {
    const pageElement: HTMLElement | null = document.getElementById('page-color-' + page.pageId);
    if (!pageElement) {
      return;
    }
    pageElement.classList.remove('bg-'+page.pageColor);
    pageElement.classList.add('bg-'+color);
    page.pageColor = color;
    this.pageService.updatePage(this.campaign.campaignId, page).then(async () =>
      this.pages = await this.pageService.loadAllpages(this.campaign.campaignId)
    );
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
