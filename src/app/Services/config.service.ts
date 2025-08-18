import {DOCUMENT, Inject, inject, Injectable} from '@angular/core';
import {CampaignService} from './campaign.service';
import {WindowRef} from './window.service';
import {Request} from '../Types/Request.type';
import {TranslateService} from '@ngx-translate/core';

interface Config {
  colorMode: "system" | "light" | "dark",
  language: string,
  supportedLanguages: string[],
  version: string
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  campaignService: CampaignService = inject(CampaignService);
  window = inject(WindowRef).getWindow();


  constructor(private translate: TranslateService, @Inject(DOCUMENT) private document: Document) {
    this.window.electronAPI.onStart().then();
  }

  async changeColorMode(colorMode: "system" | "light" | "dark") {
    this.window.electronAPI.toggleTheme(colorMode);

    const newConfig: Config = {
      ...JSON.parse(await this.window.electronAPI.onStart().then((output: string) => output)),
      colorMode: colorMode
    }

    const request: Request = {
      filePath: "config/",
      fileName: "config.json",
      content: JSON.stringify(newConfig)
    }

    await this.window.electronAPI.saveFile(request);
  }

  async loadConfig() {
    await this.campaignService.loadAllCampaigns();
    await this.window.electronAPI.onStart().then((output: string) => {
      const config: Config = JSON.parse(output);
      this.translate.addLangs(config.supportedLanguages);
      this.translate.setDefaultLang('en-US');
      this.translate.use(config.language);
      this.setHtmlLangAttribute(config.language);
      this.window.electronAPI.toggleTheme(config.colorMode);
    });
  }

  private setHtmlLangAttribute(newLang: string) {
    this.document.documentElement.lang = newLang;
  }


  async changeLanguage(language: string) {
    const newConfig: Config = {
      ...JSON.parse(await this.window.electronAPI.onStart().then((output: string) => output)),
      language: language
    }
    const request: Request = {
      filePath: "config/",
      fileName: "config.json",
      content: JSON.stringify(newConfig)
    }
    this.translate.use(language);
    this.setHtmlLangAttribute(language);

    await this.window.electronAPI.saveFile(request);
  }

}

