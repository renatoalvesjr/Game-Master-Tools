import {inject, Injectable} from '@angular/core';
import {Campaign} from '../Interfaces/Campaign.interface';
import {Note} from '../Interfaces/Note.interface';
import {Page} from '../Interfaces/Page.interface';
import {WindowRef} from './window.service';
import {CampaignDTO} from '../Interfaces/CampaignDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  campaignList: Campaign[] = [];
  window = inject(WindowRef).getWindow();

  async getCampaignById(campaignId: string): Promise<Campaign> {
    const request = {
      filePath: 'Campaign/',
      fileName: campaignId + '.json',
    }
    return await this.window.electronAPI.openFile(request).then((value: any) => {
      return JSON.parse(value.content) as Campaign;
    });
  }

  async saveFile(campaignId: string): Promise<void> {
    const conteudo: CampaignDTO = {
      filePath: 'Campaign/',
      fileName: await this.getCampaignById(campaignId).then((value: any) => {
        return value
      }) + '.json',
      content: JSON.stringify(this.getCampaignById(campaignId)),
    };
    this.window.electronAPI.saveFile(conteudo);
  }

  async loadCampaigns(): Promise<Campaign[]> {
    const request = {
      filePath: 'Campaign/',
    }
    let files: string[] = []
    await this.window.electronAPI.listFiles(request).then((value: string[]) => {
      files = value
    });

    if (files) {
      for (const file of files) {
        const request = {
          filePath: 'Campaign/',
          fileName: file,
        }
        await this.window.electronAPI.openFile(request).then((value: any) => {
            const campaign = JSON.parse(value.content) as Campaign;
            if (!this.campaignList.find((c: Campaign) => c.campaignId === campaign.campaignId)) {
              this.campaignList.push(campaign);
            }
          });
      }
    }
    this.campaignList.sort((a, b) => b.campaignUpdateDate.localeCompare(a.campaignUpdateDate));
    return this.campaignList;
  }

  async getPageById(campaignId: string, pageId: string): Promise<Page> {
    const campaign = await this.getCampaignById(campaignId);
    return campaign.campaignPages.find(
      (page: Page): boolean => page.pageId === pageId
    )! as Page;
  }

  async getNoteById(campaignId: string, pageId: string, noteId: string): Promise<Note> {
    const page = await this.getPageById(campaignId, pageId);
    return page.pageNotes.find(
      (note: Note): boolean => note.noteId === noteId
    ) as Note;
  }

  async updateCampaign(campaign: Campaign): Promise<void> {
    const filePath = 'Campaign/';
    const fileName = campaign.campaignId + '.json';
    const content = JSON.stringify(campaign);

    const request = {
      filePath,
      fileName,
      content,
    };
    await this.window.electronAPI.updateFile(request);
  }
}
