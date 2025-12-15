import { Component, inject, OnInit } from '@angular/core';
import { CampaignCardComponent } from './campaign-card/campaign-card.component';
import { CampaignService } from '../../Services/campaign.service';
import { Campaign } from '../../Types/Campaign.type';
import { RouterLink } from '@angular/router';
import { PButtonComponent } from '../../Components/Buttons/p-button/p-button.component';
import { FormatDatePipe } from '../../Pipe/format-date.pipe';
import { FormsModule } from '@angular/forms';
import { UtilsService } from '../../Services/utils.service';
import { SvgIconComponent } from 'angular-svg-icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-CampaignManagement',
  templateUrl: './CampaignManagement.component.html',
  styleUrls: ['./CampaignManagement.component.css'],
  imports: [
    CampaignCardComponent,
    RouterLink,
    PButtonComponent,
    FormatDatePipe,
    FormsModule,
    SvgIconComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class CampaignManagementComponent implements OnInit {
  campaignService: CampaignService = inject(CampaignService);
  utils: UtilsService = inject(UtilsService);

  campaignSelected!: Campaign | null;
  campaigns: Campaign[] = [];
  array: number[] = [];
  dangerMode: boolean = false;
  campaignDescriptionElement: HTMLElement | null = null;

  constructor(private translate: TranslateService) {
    this.translate.use(this.translate.currentLang);
  }

  async ngOnInit() {
    await this.loadCampaign();
  }

  async loadCampaign() {
    this.campaignService.campaigns.subscribe((campaigns: Campaign[]) => {
      this.campaigns = campaigns;
    });
  }

  selectCampaign(campaign: Campaign) {
    this.dangerMode = false;
    this.campaignSelected = campaign;
  }

  async updateCampaign(campaign: Campaign) {
    await this.campaignService.updateCampaign(campaign);
  }

  async deleteCampaign(campaignId: string) {
    this.campaignSelected = null;
    await this.campaignService.deleteCampaign(campaignId);
    await this.loadCampaign();
  }

  toggleCampaignDescriptionEdit() {
    this.campaignDescriptionElement = document.getElementById(
      `campaign-${this.campaignSelected!.campaignId}-description`,
    );
    if (this.campaignSelected) {
      const campaignDescriptionElement = document.getElementById(
        `campaign-${this.campaignSelected.campaignId}-description`,
      );
      if (!campaignDescriptionElement) {
        return;
      }
      campaignDescriptionElement.contentEditable =
        campaignDescriptionElement.contentEditable === 'true'
          ? 'false'
          : 'true';
      campaignDescriptionElement.focus();
    }
  }

  async saveCampaignDescription() {
    if (this.campaignSelected) {
      const campaignDescriptionElement = document.getElementById(
        `campaign-${this.campaignSelected.campaignId}-description`,
      );
      if (!campaignDescriptionElement) {
        return;
      }
      const updatedDescription = campaignDescriptionElement.innerText.trim();
      if (updatedDescription !== this.campaignSelected!.campaignDescription) {
        this.campaignSelected!.campaignDescription = updatedDescription;
      }
      await this.updateCampaign(this.campaignSelected!);
      campaignDescriptionElement.contentEditable = 'false';
    }
  }

  async changeCampaignName() {
    if (this.campaignSelected) {
      const campaignNameElement = document.getElementById(
        `campaign-${this.campaignSelected.campaignId}-name`,
      );
      if (!campaignNameElement) {
        return;
      }
      campaignNameElement.contentEditable = 'true';
      campaignNameElement.focus();
      const range = document.createRange();
      range.selectNodeContents(campaignNameElement);
      const selection = window.getSelection();
      selection!.removeAllRanges();
      selection!.addRange(range);

      const disableContentEditable = async () => {
        campaignNameElement.contentEditable = 'false';
        campaignNameElement.removeEventListener('blur', disableContentEditable);
        campaignNameElement.removeEventListener(
          'keydown',
          disableContentEditable,
        );

        const updatedName = campaignNameElement.innerText.trim();
        if (updatedName !== this.campaignSelected!.campaignName.trim()) {
          this.campaignSelected!.campaignName = updatedName;
        }
        await this.updateCampaign(this.campaignSelected!);

        this.campaignSelected!.campaignUpdateDate = this.utils.getTimeNow();
        this.campaignService.updateCampaign(this.campaignSelected!).then();
      };
      const onKeyDown = async (evt: KeyboardEvent) => {
        if (evt.key === 'Enter') {
          await disableContentEditable();
        } else if (evt.key === 'Esc') {
          evt.preventDefault();
          return;
        }
      };

      campaignNameElement.addEventListener('blur', disableContentEditable);
      campaignNameElement.addEventListener('keydown', onKeyDown);
    }
  }

  async changeCampaignImage() {
    if (this.campaignSelected) {
      const campaignImageElement = document.getElementById(
        `campaign-${this.campaignSelected.campaignId}-image`,
      );
      if (!campaignImageElement) {
        return;
      }
      campaignImageElement.contentEditable = 'true';
      campaignImageElement.focus();
      const range = document.createRange();
      range.selectNodeContents(campaignImageElement);
      const selection = window.getSelection();
      selection!.removeAllRanges();
      selection!.addRange(range);

      const disableContentEditable = async () => {
        campaignImageElement.contentEditable = 'false';
        campaignImageElement.removeEventListener(
          'blur',
          disableContentEditable,
        );
        campaignImageElement.removeEventListener(
          'keydown',
          disableContentEditable,
        );

        const updatedUrl = campaignImageElement.innerText.trim();
        if (updatedUrl !== this.campaignSelected!.campaignImageUrl.trim()) {
          this.campaignSelected!.campaignImageUrl = updatedUrl;
        }
        await this.updateCampaign(this.campaignSelected!);

        this.campaignSelected!.campaignUpdateDate = this.utils.getTimeNow();
        this.campaignService.updateCampaign(this.campaignSelected!).then();
      };
      const onKeyDown = async (evt: KeyboardEvent) => {
        if (evt.key === 'Enter') {
          await disableContentEditable();
        } else if (evt.key === 'Esc') {
          evt.preventDefault();
          return;
        }
      };

      campaignImageElement.addEventListener('blur', disableContentEditable);
      campaignImageElement.addEventListener('keydown', onKeyDown);
    }
  }
}
