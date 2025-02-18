// noinspection JSUnusedGlobalSymbols

import {Component, inject, OnInit} from '@angular/core';
import {CampaignService} from '../../Services/campaign.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  campaignService = inject(CampaignService);
  campaignList!: Campaign[];

  constructor() {
  }

  /*
  * Espaço para variaveis usadas para estilização rápida pelo servidor web
  */
  campaignSelected = {
    campaignId: "1",
    campaignName: "Delta Rising: The Entrance of the Labyrinth",
    campaignCreationDate: "2025-01-01",
    campaignUpdateDate: "2025-02-17T18:24:45.881Z",
    campaignImageUrl: "https://mir-s3-cdn-cf.behance.net/project_modules/disp/f85e0766901907.5b2732dbe2eaf.png",
    campaignPages: [
      {
        pageId: "11",
        pageTitle: "Walls",
        pageNotes: [
          {
            noteId: "112",
            noteContent: "<p>Right where the chaos reigns.</p>",
            noteIndex: 1,
            noteColor: "#ffffff",
            noteCreationDate: "2025-01-01",
            noteUpdateDate: "2025-01-01",
            noteTitle: "The Middle Clearance"
          }
        ],
        pageCreationDate: "string",
        pageIndex: 1,
        pageActive: true
      }
    ],
    campaignSystemId: "Delta Green",
    campaignIndex: 0,
    campaignDescription: "Uma longa e detalhada descrição para compor o campo que será usado em testes para suas funçãoes de tamanho e renderização na tela de forma dinâmica.",
    active: false
  }

  async ngOnInit() {
    await this.campaignService.loadCampaigns();
    this.campaignList = this.campaignService.campaignList;
  }

}
