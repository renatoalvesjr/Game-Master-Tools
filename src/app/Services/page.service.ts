import {inject, Injectable} from '@angular/core';
import {Page} from '../Interfaces/Page.interface';
import {Request} from '../Interfaces/Request.interface';
import {WindowRef} from './window.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  window = inject(WindowRef).getWindow();

  private pageSubject = new BehaviorSubject<Page[]>([]);
  pageList = this.pageSubject.asObservable();

  constructor() {
  }

  async loadAllpages(campaignId: string) {
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Pages/",
      fileName: "/page.json"
    }

    try{
      await this.window.electronAPI.returnAllFiles(request).then((value: string[]) => {
        const pages: Page[] = [];
        value.forEach((page) => {
          pages.push(JSON.parse(page) as Page);
        })
        this.pageSubject.next(pages);
      });
    } catch (error) {
      console.error("Could not load pages: ", error);
    }


  }

  async getPageById(campaignId: string, pageId: string) {
    if (pageId === null) {
      throw new Error('Page ID is null or undefined');
    }
    const request: Request = {
      filePath: "Campaigns/" + campaignId + "/Pages/" + pageId + "/page.json"
    }
    try {
      return JSON.parse(await this.window.electronAPI.returnFile(request)) as Page;
    } catch (error) {
      throw new Error("Error getPageById: " + JSON.stringify(error));
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
      await this.loadAllpages(campaignId);
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
      await this.loadAllpages(campaignId);
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
      await this.loadAllpages(campaignId);
    } catch (error) {
      throw new Error("Error deleting page: " + JSON.stringify(error));
    }
  }
}
