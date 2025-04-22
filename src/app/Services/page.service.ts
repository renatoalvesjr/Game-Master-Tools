import {inject, Injectable} from '@angular/core';
import {Page} from '../Types/Page.type';
import {Request} from '../Types/Request.type';
import {WindowRef} from './window.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  window = inject(WindowRef).getWindow();

  constructor() {
  }

  async loadAllPages(campaignId: string): Promise<Page[]|null>{
    if (!campaignId) {
      console.error('Campaign ID is required to load pages');
      return null;
    }

    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Pages/",
      fileName: "/page.json"
    };

    try {
      const pages: Page[] = [];
      const response = await this.window.electronAPI.returnAllFiles(request);
      if (!response) {
        console.error('No response received from electronAPI.returnAllFiles');
        return null;
      }

      if (!Array.isArray(response)) {
        console.error('Invalid response from electronAPI.returnAllFiles. Expected an array.');
        return null;
      }

      response.forEach((page) => {
        try {
          pages.push(JSON.parse(page) as Page);
        } catch (parseError) {
          console.error('Failed to parse page JSON:', parseError);
        }
      });

      return pages;
    } catch (error) {
      console.error('Error loading pages:', error);
      return null;
    }
  }

  async createPage(page: Page, campaignId: string) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + '/Pages/' + page.pageId,
      fileName: '/page.json',
      content: JSON.stringify(page)
    }
    try {
      await this.window.electronAPI.saveFile(request);
      await this.loadAllPages(campaignId);
    } catch (error) {
      throw new Error("Error creating page: " + JSON.stringify(error));
    }
  }

  async updatePage(campaignId: string, page: Page) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + page.pageId,
      fileName: "/page.json",
      content: JSON.stringify(page)
    }
    try {
      await this.window.electronAPI.saveFile(request);
      await this.loadAllPages(campaignId);
    } catch (error) {
      throw new Error("Error updating page: " + JSON.stringify(error));
    }
  }

  async deletePage(campaignId: string, pageId: string) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + pageId + '/',
      fileName: "",
    }
    try {
      await this.window.electronAPI.deleteFile(request);
      await this.loadAllPages(campaignId);
    } catch (error) {
      throw new Error("Error deleting page: " + JSON.stringify(error));
    }
  }
}
