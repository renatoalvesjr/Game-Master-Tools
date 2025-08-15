import {inject, Injectable} from '@angular/core';
import {WindowRef} from './window.service';
import {TooltipType} from '../Types/Tooltip.type';
import {Request} from '../Types/Request.type';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  window = inject(WindowRef).getWindow();

  constructor() {
  }

  async addTooltip(campaignId: string, mapPageId: string, mapId: string, tooltip: TooltipType): Promise<boolean> {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + mapId + "/Tooltips/",
      fileName: `${tooltip.id}.json`,
      content: JSON.stringify(tooltip)
    }

    try {
      await this.window.electronAPI.saveFile(request);
      return true;
    } catch (e) {
      console.error('Error on addTooltip:', e);
      return false;
    }
  }


  async getTooltip(campaignId: string, mapPageId: string, mapId: string, tooltipId: string): Promise<TooltipType> {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + mapId + "/Tooltips/" + `${tooltipId}.json` ,
    }

    try {
      const response = await this.window.electronAPI.returnFile(request);
      return JSON.parse(response) as TooltipType;
    } catch (e) {
      console.error('Error on getTooltip:', e);
      return {} as TooltipType;
    }
  }

  async getAllTooltip(campaignId: string, mapPageId: string, mapId: string): Promise<TooltipType[] | null> {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + mapId + "/Tooltips",
    }

    try {
      const files = await this.window.electronAPI.returnAllFiles(request);
      if (!files) {
        console.error('Error: returnAllFiles returned null or undefined');
        return null;
      }
      return files.map((file: string) => {
        try {
          return JSON.parse(file) as TooltipType;
        } catch (e) {
          console.error(`Error parsing file: ${e}`);
          return null;
        }
      }).filter((tooltip: TooltipType | null) => tooltip !== null);


    } catch (e) {
      console.error('Error on getAllTooltip:', e);
      return [] as TooltipType[];
    }
  }

  async updateTooltip(campaignId: string, mapPageId: string, mapId: string, tooltip: TooltipType): Promise<boolean> {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Maps/" + mapPageId + "/MapList/" + mapId + "/Tooltips",
      fileName: `${tooltip.id}.json`,
      content: JSON.stringify(tooltip)
    }

    try {
      await this.window.electronAPI.saveFile(request);
      return true;
    } catch (e) {
      console.error('Error on updateTooltip:', e);
      return false;
    }
  }

  async deleteTooltip(campaingId: string, mapPageId: string, mapId: string, tooltipId: string): Promise<boolean> {
    const request: Request = {
      filePath: "Campaigns/" + campaingId + "/Maps/" + mapPageId + "/MapList/" + mapId + "/Tooltips",
      fileName: tooltip.id,
    }

    try {
      await this.window.electronAPI.deleteFile(request);
      return true;
    } catch (e) {
      console.error('Error on deleteTooltip:', e);
      return false;
    }
  }
}
