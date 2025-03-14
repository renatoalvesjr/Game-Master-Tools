import {inject, Injectable} from '@angular/core';
import {CampaignService} from './campaign.service';
import {WindowRef} from './window.service';
import {Request} from '../Interfaces/Request.interface';
import {TranslateService} from '@ngx-translate/core';

interface Config {
  colorMode: "system" | "light" | "dark",
  language: string,
  supportedLanguages: string[]
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  campaignService: CampaignService = inject(CampaignService);
  window = inject(WindowRef).getWindow();

  constructor(private translate: TranslateService) {
    this.window.electronAPI.onStart().then();
  }

  async loadConfig() {
    await this.campaignService.loadAllCampaigns();
    await this.window.electronAPI.onStart().then((output: string) => {
      const config: Config = JSON.parse(output);
      this.translate.addLangs(config.supportedLanguages);
      this.translate.setDefaultLang('en');
      this.translate.use(config.language);
    });
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

    await this.window.electronAPI.saveFile(request);
  }
}

