import {Component, inject} from '@angular/core';
import {UtilsService} from '../../Services/utils.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {CampaignService} from '../../Services/campaign.service';
import {PButtonComponent} from '../../Components/Buttons/p-button/p-button.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-campaign',
  imports: [ReactiveFormsModule, PButtonComponent],
  templateUrl: './create-campaign.component.html',
  styleUrl: './create-campaign.component.scss'
})
export class CreateCampaignComponent {
  utils: UtilsService = inject(UtilsService);
  campaignService: CampaignService = inject(CampaignService);

  hiddenDesciption = true;

  campaignForm = new FormGroup({
    campaignName: new FormControl('New Campaign'),
    campaignDescription: new FormControl(''),
    campaignImageUrl: new FormControl('https://www.roleplayingtips.com/wpcms/wp-content/uploads/campaign-seeds-1020x510.jpg'),
  })

  async createCampaign(){
    const campaign: Campaign = {
      campaignId: this.utils.getUUID(),
      campaignIndex: 0,
      campaignName: this.campaignForm.value.campaignName!,
      campaignDescription: this.campaignForm.value.campaignDescription!,
      campaignSystemId: '1',
      campaignUpdateDate: this.utils.getTimeNow(),
      campaignCreationDate: this.utils.getTimeNow(),
      campaignPages: [],
      campaignImageUrl: this.campaignForm.value.campaignImageUrl!,
      active: true,
    }
    return await this.campaignService.createCampaign(campaign);
  }

}
