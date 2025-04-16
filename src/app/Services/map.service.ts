import {inject, Injectable} from '@angular/core';
import {WindowRef} from './window.service';
import {MapPage} from '../Types/MapPage.type';
import {MapCanvas} from '../Types/MapCanvas.type';
import {BehaviorSubject} from 'rxjs';
import {Request} from '../Types/Request.type';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  window = inject(WindowRef).getWindow();
  private selectedDataSubject = new BehaviorSubject<{ map: MapCanvas | null, mapPage: MapPage | null, campaignId: string}>({ map: null, mapPage: null, campaignId: '' });
  selectedMap$ = this.selectedDataSubject.asObservable();

  selectMap(map: MapCanvas | null, mapPage: MapPage | null, campaignId: string) {
    this.selectedDataSubject.next({ map: map, mapPage: mapPage, campaignId});
  }

  unselectMap() {
    this.selectedDataSubject.next({ map: null, mapPage: null, campaignId: '' });
  }

  async loadAllMapPages(campaignId: string): Promise<MapPage[] | null> {
    if (!campaignId) {
      console.error('Error: campaignId is null or undefined');
      return Promise.resolve(null);
    }

    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/",
      fileName: "/maps.json"
    };

    try {
      return this.window.electronAPI.returnAllFiles(request)
        .then((files: string[]) => {
          if (!files) {
            console.error('Error: returnAllFiles returned null or undefined');
            return null;
          }

          const mapPages: MapPage[] = files.map((file: string) => {
            try {
              return JSON.parse(file) as MapPage;
            } catch (e) {
              console.error(`Error parsing file: ${e}`);
              return null;
            }
          }).filter((mapPage: MapPage | null) => mapPage !== null);

          return mapPages;
        })
        .catch((error: any) => {
          console.error(`Error loading map pages: ${error}`);
          return null;
        });
    } catch (e) {
      console.error(`Error creating request: ${e}`);
      return Promise.resolve(null);
    }
  }
  async addMapPage(campaignId: string, map: MapPage) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + map.mapPageId,
      fileName: "/maps.json",
      content: JSON.stringify(map)
    }
    try{
      await this.window.electronAPI.saveFile(request);
    } catch (e) {
      console.error('Error on addMapPage:', e);
    }
  }
  async updateMapPage(campaignId: string, mapPage: MapPage) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPage.mapPageId,
      fileName: "/maps.json",
      content: JSON.stringify(mapPage)
    }
    try {
      await this.window.electronAPI.saveFile(request);
      await this.loadAllMapPages(campaignId);
    } catch (e) {
      console.error('Error on updateMapPage:', e);
    }
  }
  async deleteMapPage(campaignId: string, mapPageId: string) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId,
      fileName: ""
    }
    try {
      await this.window.electronAPI.deleteFile(request);
      await this.loadAllMapPages(campaignId);
    } catch (e) {
      console.error('Error on deleteMapPage:', e);
    }
  }

  async addMap(campaignId: string, mapPage: MapPage, map: MapCanvas) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPage.mapPageId + "/MapList/" + map.mapId,
      fileName: "/map.json",
      content: JSON.stringify(map)
    }
    try{
      await this.window.electronAPI.saveFile(request);
    } catch (e) {
      console.error('Error on addMap:', e);
    }
  }
  async deleteMap(campaignId: string, mapPageId: string, mapId: string) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + mapId,
      fileName: ""
    }
    try {
      await this.window.electronAPI.deleteFile(request);
      await this.loadAllMapPages(campaignId);
    } catch (e) {
      console.error('Error on deleteMap:', e);
    }
  }
  async updateMap(campaignId: string, mapPageId: string, map: MapCanvas) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + map.mapId,
      fileName: "/map.json",
      content: JSON.stringify(map)
    }
    try {
      await this.window.electronAPI.saveFile(request);
      await this.loadAllMapPages(campaignId);
    } catch (e) {
      console.error('Error on updateMap:', e);
    }
  }
  async loadAllMaps(campaignId: string, mapPageId: string): Promise<MapCanvas[] | null> {
    if (!campaignId) {
      console.error('Error: campaignId is null or undefined');
      return Promise.resolve(null);
    }

    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList",
      fileName: "/map.json"
    };

    try {
      return this.window.electronAPI.returnAllFiles(request)
        .then((files: string[]) => {
          if (!files) {
            console.error('Error: returnAllFiles returned null or undefined');
            return null;
          }

          const maps: MapCanvas[] = files.map((file: string) => {
            try {
              return JSON.parse(file) as MapCanvas;
            } catch (e) {
              console.error(`Error parsing file: ${e}`);
              return null;
            }
          }).filter((map: MapCanvas | null) => map !== null);

          return maps;
        })
        .catch((error: any) => {
          console.error(`Error loading map pages: ${error}`);
          return null;
        });
    } catch (e) {
      console.error(`Error creating request: ${e}`);
      return Promise.resolve(null);
    }
  }
}
