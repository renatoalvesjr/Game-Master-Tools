import {Routes} from '@angular/router';
import {NavigationComponent} from './Nav/Navigation/Navigation.component';
import {CampaignNavComponent} from './Nav/CampaignNav/CampaignNav.component';
import {ItemsNavComponent} from './Nav/ItemsNav/ItemsNav.component';
import {SystemNavComponent} from './Nav/SystemNav/SystemNav.component';
import {SoundNavComponent} from './Nav/SoundNav/SoundNav.component';
import {CampaignManagementComponent} from './Pages/CampaignManagement/CampaignManagement.component';
import {SettingsComponent} from './Pages/settings/settings.component';
import {InfoComponent} from './Pages/info/info.component';
import {HomeComponent} from './Pages/home/home.component';
import {CreateCampaignComponent} from './Pages/create-campaign/create-campaign.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {path: '', component: HomeComponent},
      {
        path: 'campaign-management', component: CampaignManagementComponent,
      },
      { path: 'new-campaign', component: CreateCampaignComponent },
      {path: 'items', component: ItemsNavComponent},
      {path: 'systems', component: SystemNavComponent},
      {path: 'sound', component: SoundNavComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'info', component: InfoComponent},
      {
        path: 'campaign/:campaignId',
        component: CampaignNavComponent,

      },
    ],
  },
];
