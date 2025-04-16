import {Component, inject, Input, OnInit} from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";
import {TranslatePipe} from "@ngx-translate/core";
import {CampaignService} from '../../../Services/campaign.service';
import {ActivatedRoute} from '@angular/router';
import {Campaign} from '../../../Types/Campaign.type';
import {MapService} from '../../../Services/map.service';
import {MapPage} from '../../../Types/MapPage.type';
import {UtilsService} from '../../../Services/utils.service';
import {MapNavItemComponent} from '../../../Components/map-nav-item/map-nav-item.component';
import {ColorSelectionComponent} from '../../../Components/color-selection/color-selection.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {NgStyle} from '@angular/common';
import {MapCanvas} from '../../../Types/MapCanvas.type';
import {MapCanvasNavItemComponent} from '../../../Components/map-canvas-nav-item/map-canvas-nav-item.component';
import {Page} from '../../../Types/Page.type';

@Component({
  selector: 'app-map-nav',
  imports: [
    SvgIconComponent,
    TranslatePipe,
    MapNavItemComponent,
    ColorSelectionComponent,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    NgStyle,
    MapCanvasNavItemComponent
  ],
  templateUrl: './map-nav.component.html',
  styleUrl: './map-nav.component.scss'
})
export class MapNavComponent implements OnInit {
  @Input() campaign!: Campaign;
  campaignService = inject(CampaignService);
  route = inject(ActivatedRoute);
  utils = inject(UtilsService);
  mapService = inject(MapService);
  maps!: MapPage[] | null;

  mapsHidden: boolean = false;

  mapCanvas: MapCanvas[] | null = [];

  async ngOnInit() {
    await this.updateMapPages();
  }

  async changeColor(mapPage: MapPage, color: string) {
    mapPage.mapPageColor = color;
    const mapPageColor = document.getElementById('map-page-color-' + mapPage.mapPageId);
    if (mapPageColor) {
      mapPageColor.style.backgroundColor = color;
    }
    await this.mapService.updateMapPage(this.campaign.campaignId, mapPage);
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    this.campaignService.updateCampaign(this.campaign).then();
  }

  async toggleMaps(mapPage: MapPage) {
    mapPage.active = !mapPage.active;
    this.mapService.updateMapPage(this.campaign.campaignId, mapPage).then(async () => {
      this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
    });
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    const campaign = this.campaign;
    await this.campaignService.updateCampaign(campaign);
  }

  async addMapPage() {
    const map: MapPage = {
      mapPageId: this.utils.getUUID(),
      mapPageName: 'New Map',
      mapPageColor: '#F3F6F8',
      mapPageCreationDate: this.utils.getTimeNow(),
      mapPageUpdateDate: this.utils.getTimeNow(),
      mapPageIndex: 0,
      active: true,
    }

    try {
      this.mapService.addMapPage(this.campaign.campaignId, map).then(async () => {
        this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
      });
    } catch (e) {
      console.error('Error on addMapPage:', e);
    }
  }

  async updateMapPages() {
    this.route.params.subscribe(async (params: any) => {
      this.campaign = await this.campaignService.getCampaignById(params['campaignId']);
      this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
    })
  }

  async deleteMapPage(mapPageId: string) {
    this.mapService.deleteMapPage(this.campaign.campaignId, mapPageId).then(async () => {
      this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
    });
  }

  async addMap(mapPage: MapPage) {
    const map: MapCanvas = {
      mapId: this.utils.getUUID(),
      mapName: 'New Map',
      mapCreationDate: this.utils.getTimeNow(),
      mapUpdateDate: this.utils.getTimeNow(),
      mapContent: '',
      mapIndex: 0,
      active: true,
    }
    this.mapService.addMap(this.campaign.campaignId, mapPage, map).then(async () => {
      this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
    });
  }

  togglePageEditable(mapPage: MapPage) {
    const mapPageElement = document.getElementById('map-page-' + mapPage.mapPageId);
    if (!mapPageElement) {
      return;
    }
    mapPageElement.contentEditable = 'true';
    mapPageElement.focus();

    const range = document.createRange();
    range.selectNodeContents(mapPageElement);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);

    const disableContentEditable = async () => {
      mapPageElement.contentEditable = 'false';
      mapPageElement.removeEventListener('blur', disableContentEditable);
      mapPageElement.removeEventListener('keydown', disableContentEditable);

      const updateName = mapPageElement.innerText.trim();
      const updatedMapPage: MapPage = {
        ...mapPage,
        mapPageName: updateName,
      }
      await this.mapService.updateMapPage(this.campaign.campaignId, updatedMapPage)
      await this.updateMapPages();

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

    mapPageElement.addEventListener('blur', disableContentEditable)
    mapPageElement.addEventListener('keydown', onKeyDown)
  }

  async loadAllMaps(mapPage: MapPage) {
    try {
      for(mapPage of this.maps as MapPage[]) {
        this.mapCanvas = await this.mapService.loadAllMaps(this.campaign.campaignId, mapPage.mapPageId);
      }
    } catch (e) {
      console.error('Error on loadMapsByPage:', e);
    }
  }
}
