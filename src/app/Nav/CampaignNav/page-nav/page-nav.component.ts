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
import {NgClass, NgStyle} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-page-nav',
  imports: [
    MatMenuModule,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NoteNavComponent,
    NgStyle,
    SvgIconComponent,
    TranslateModule,
    NgClass
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

  pageColors: string[] = [
    '#F5F5DC',
    '#FFF599',
    '#DAA520',
    '#FFD700',
    '#808080',
    '#C0C0C0',
    '#8B9467',
    '#A0522D',
    '#FFC080',
    '#FFA07A',
    '#EEC591',
    '#C2B280',
    '#A9D700',
    '#B2FFFC',
    '#778899',
    '#66D9EF',
    '#8BC34A',
    '#4CAF50',
    '#F8E231',
    '#9C27B0',
    '#E91E63',
    '#FF9800',
    '#795548',
    '#3E8E41',
    '#009688',
    '#455A64',
    '#607D8B',
    '#9E9E9E',
    '#64B5F6',
    '#2196F3',
  ]
  constructor(private translate: TranslateService) {
    this.translate.use(this.translate.currentLang)
  }

  async ngOnInit() {
    await this.updatePages()
  }


  async updatePages() {
    this.route.params.subscribe(async (params: any) => {
        this.campaign = await this.campaignService.getCampaignById(params['campaignId']);
        this.pages = await this.pageService.loadAllPages(this.campaign.campaignId);
        this.applyColor();
      }
    )
  }

  async addPage() {
    const page: Page = {
      pageId: this.utils.getUUID(),
      pageIndex: 0,
      pageTitle: 'New Page',
      pageCreationDate: this.utils.getTimeNow(),
      pageActive: true,
      pageColor: '#F3F6F8'
    }
    this.pageService.createPage(page, this.campaign.campaignId).then(async () => {
        this.pages = await this.pageService.loadAllPages(this.campaign.campaignId);
      }
    )
    ;
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
    this.applyColor();
    await this.updatePages();

  }

  async addNote(pageId: string) {
    const note: Note = {
      noteId: this.utils.getUUID(),
      noteTitle: 'New Note',
      noteContent: '',
      noteIndex: 0,
      noteColor: '#F3F6F8',
      noteCreationDate: this.utils.getTimeNow(),
      noteUpdateDate: this.utils.getTimeNow(),
      active: true,
    }
    this.noteService.addNote(this.campaign.campaignId, pageId, note).then(async () => {
      await this.updatePages()
    });
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();

    const campaign = this.campaign;
    await this.campaignService.updateCampaign(campaign);
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
      this.pages = await this.pageService.loadAllPages(this.campaign.campaignId)
    });
  }


  applyColor() {
    for (let page of this.pages!) {
      if (page) {
        this.changeColor(page, page.pageColor).then();
      }
    }
  }

  async changeColor(page: Page, color: string) {
    page.pageColor = color;
    const pageColor = document.getElementById('page-color-' + page.pageId);
    if (pageColor) {
      pageColor.style.backgroundColor = color;
    }
    await this.pageService.updatePage(this.campaign.campaignId, page);
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
