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
import {NgStyle} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PageNavItemComponent} from '../../../Components/page-nav-item/page-nav-item.component';
import {ColorSelectionComponent} from '../../../Components/color-selection/color-selection.component';

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
    PageNavItemComponent,
    ColorSelectionComponent,
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
    '#F3F6F8',  // Cinza muito claro
    '#F5F5DC',  // Bege
    '#FFF599',  // Amarelo claro
    '#F8E231',  // Amarelo médio
    '#FFD700',  // Dourado
    '#EEC591',  // Marrom areia (pêssego)
    '#FFC080',  // Laranja claro
    '#FFA07A',  // Salmão
    '#FF9800',  // Laranja
    '#DAA520',  // Ouro (marrom dourado)
    '#C2B280',  // Marrom claro (amarelado)
    '#A9D700',  // Verde-amarelado
    '#B2FFFC',  // Azul claro (turquesa)
    '#66D9EF',  // Azul celeste
    '#64B5F6',  // Azul médio
    '#2196F3',  // Azul
    '#8BC34A',  // Verde claro
    '#4CAF50',  // Verde
    '#009688',  // Verde-azulado
    '#E91E63',  // Rosa choque
    '#9C27B0',  // Roxo
    '#A0522D',  // Marrom avermelhado (sienna)
    '#795548',  // Marrom escuro
    '#3E8E41',  // Verde escuro
    '#607D8B',  // Azul acinzentado
    '#778899',  // Cinza azulado
    '#455A64',  // Azul escuro acinzentado
    '#9E9E9E',  // Cinza médio
    '#808080',  // Cinza escuro
    '#82828f',  // Azul acinzentado escuro

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

  togglePage(page: Page) {
    page.pageActive = !page.pageActive;
    this.pageService.updatePage(this.campaign.campaignId, page).then(async () => {
      this.pages = await this.pageService.loadAllPages(this.campaign.campaignId)
    });
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }
}
