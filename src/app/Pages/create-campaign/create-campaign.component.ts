import {Component, inject} from '@angular/core';
import {UtilsService} from '../../Services/utils.service';
import {Campaign} from '../../Interfaces/Campaign.interface';
import {CampaignService} from '../../Services/campaign.service';
import {PButtonComponent} from '../../Components/Buttons/p-button/p-button.component';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-campaign',
  imports: [ReactiveFormsModule, PButtonComponent],
  templateUrl: './create-campaign.component.html',
  styleUrl: './create-campaign.component.scss'
})
export class CreateCampaignComponent {
  utils: UtilsService = inject(UtilsService);
  campaignService: CampaignService = inject(CampaignService);
  router: Router = inject(Router);

  hiddenDesciption = true;

  campaignForm = new FormGroup({
    campaignName: new FormControl('Nova Campanha'),
    campaignDescription: new FormControl(''),
    campaignImageUrl: new FormControl('https://www.roleplayingtips.com/wpcms/wp-content/uploads/campaign-seeds-1020x510.jpg'),
    campaignSystemName: new FormControl(''),
    campaignCustomSystemName: new FormControl(''),
    active: new FormControl(true),
  })

  async createCampaign(){
    const campaign: Campaign = {
      campaignId: this.utils.getUUID(),
      campaignIndex: 0,
      campaignName: this.campaignForm.value.campaignName!,
      campaignDescription: this.campaignForm.value.campaignDescription!,
      campaignSystemName: this.campaignForm.value.campaignSystemName! === 'custom' ? this.campaignForm.value.campaignCustomSystemName! :this.campaignForm.value.campaignSystemName!,
      campaignUpdateDate: this.utils.getTimeNow(),
      campaignCreationDate: this.utils.getTimeNow(),
      campaignPages: [],
      campaignImageUrl: this.campaignForm.value.campaignImageUrl!,
      active: this.campaignForm.value.active!,
    }
    // await this.campaignService.createCampaign(campaign);
    // await this.router.navigate(['/campaign/:campaignId', {campaignId: campaign.campaignId}]);

    console.log(campaign);
  }

}
