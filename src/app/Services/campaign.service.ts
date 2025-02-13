import {inject, Injectable} from '@angular/core';
import {Campaign} from '../Interfaces/Campaign.interface';
import campaignList from '../Tests/campaignList.json';
import {Note} from '../Interfaces/Note.interface';
import {Page} from '../Interfaces/Page.interface';
import {WindowRef} from './window.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  campaignList = JSON.parse(JSON.stringify(campaignList)) as Campaign[];
  window = inject(WindowRef).getWindow();

  async getCampaigns(): Promise<Campaign[]> {
    // const campaign = this.window.electronAPI.openFile
    return this.campaignList;
  }

  getCampaignById(campaignId: string): Campaign {
    return campaignList.find(
      (campaign: Campaign): boolean => campaign.campaignId === campaignId
    ) as Campaign;
  }

  testSaveFile() {
    this.window.electronAPI.saveFile('test', 'test');
  }

  async testOpenFile() {
    const filePath = await this.window.electronAPI.openFile()
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const text = await response.text();

  }

  getPageById(campaignId: string, pageId: string): Page {
    return this.getCampaignById(campaignId)!.campaignPages!.find(
      (page: Page): boolean => page.pageId === pageId
    )! as Page;
  }

  getNoteById(campaignId: string, pageId: string, noteId: string): Note {
    return this.getPageById(campaignId, pageId).pageNotes.find(
      (note: Note): boolean => note.noteId === noteId
    ) as Note;
  }


}
