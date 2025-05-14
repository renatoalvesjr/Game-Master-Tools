import {Component, inject, Input, OnInit} from '@angular/core';
import {MapPage} from '../../Types/MapPage.type';
import {MapCanvas} from '../../Types/MapCanvas.type';
import {MapService} from '../../Services/map.service';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {TranslatePipe} from '@ngx-translate/core';
import {NgStyle} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {Campaign} from '../../Types/Campaign.type';
import {UtilsService} from '../../Services/utils.service';
import {CampaignService} from '../../Services/campaign.service';

@Component({
  selector: 'app-map-canvas-nav-item',
  imports: [
    MatMenu,
    MatMenuItem,
    TranslatePipe,
    NgStyle,
    SvgIconComponent,
    MatMenuTrigger
  ],
  templateUrl: './map-canvas-nav-item.component.html',
  styleUrl: './map-canvas-nav-item.component.scss'
})
export class MapCanvasNavItemComponent implements OnInit{
  @Input() mapPage: MapPage | null = null;
  @Input() campaign!: Campaign;

  selected: MapCanvas | null = null;

  campaignService = inject(CampaignService)
  mapService = inject(MapService)
  utils = inject(UtilsService)

  maps: MapCanvas[] | null = null;
  async ngOnInit() {
    await this.loadAllMaps(this.mapPage!)
    this.mapService.selectedMap$.subscribe(
      (data) => this.selected = data.map
    )
  }

  async loadAllMaps(mapPage: MapPage) {
    try {
      this.maps = await this.mapService.loadAllMaps(this.campaign.campaignId, mapPage.mapPageId);
    } catch (e) {
      console.error('Error on loadMapsByPage:', e);
    }
  }

  selectMap(map: MapCanvas) {
    this.mapService.selectMap(map, this.mapPage, this.campaign.campaignId);
  }

  deleteMap(map: MapCanvas) {
    this.mapService.deleteMap(this.campaign.campaignId, this.mapPage!.mapPageId, map.mapId).then(async () => {
      this.maps = await this.mapService.loadAllMaps(this.campaign.campaignId, this.mapPage!.mapPageId);
    });
  }

  async updateMaps() {
    this.maps = await this.mapService.loadAllMaps(this.campaign.campaignId, this.mapPage!.mapPageId);
  }

  renameMap(map: MapCanvas) {
    const mapElement = document.getElementById('map-canvas-' + map.mapId);
    if (!mapElement) {
      return;
    }
    mapElement.contentEditable = 'true';
    mapElement.focus();

    const range = document.createRange();
    range.selectNodeContents(mapElement);
    const selection = window.getSelection();
    selection!.removeAllRanges();
    selection!.addRange(range);

    const disableContentEditable = async () => {
      mapElement.contentEditable = 'false';
      mapElement.removeEventListener('blur', disableContentEditable);
      mapElement.removeEventListener('keydown', disableContentEditable);

      const updateName = mapElement.innerText.trim();
      const updatedMap: MapCanvas = {
        ...map,
        mapName: updateName,
      }

      await this.mapService.updateMap(this.campaign.campaignId, this.mapPage!.mapPageId, updatedMap)
      await this.updateMaps();

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

    mapElement.addEventListener('blur', disableContentEditable);
    mapElement.addEventListener('keydown', onKeyDown);

  }

}
