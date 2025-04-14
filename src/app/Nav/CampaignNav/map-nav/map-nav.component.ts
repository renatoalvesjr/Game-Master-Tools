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
    NgStyle
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

  async ngOnInit() {
    await this.updateMapPages()
  }
  async changeColor(mapPage: MapPage, color: string) {
    mapPage.mapPageColor = color;
    this.mapService.updateMapPage(this.campaign.campaignId, mapPage.mapPageId).then(async () => {
      this.maps = await this.mapService.loadAllMapPages(this.campaign.campaignId);
    });
    this.campaign.campaignUpdateDate = this.utils.getTimeNow();
    const campaign = this.campaign;
    await this.campaignService.updateCampaign(campaign);
  }
  async toggleMaps(mapPage: MapPage) {
    mapPage.active = !mapPage.active;
    this.mapService.updateMapPage(this.campaign.campaignId, mapPage.mapPageId).then(async () => {
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
}
