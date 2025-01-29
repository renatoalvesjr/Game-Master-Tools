import { Routes } from '@angular/router';
import { NavigationComponent } from './Components/Navigation/Navigation.component';
import { CampaignNavComponent } from './Components/SystemNavs/CampaignNav/CampaignNav.component';
import { ItemsNavComponent } from './Components/SystemNavs/ItemsNav/ItemsNav.component';
import { SystemNavComponent } from './Components/SystemNavs/SystemNav/SystemNav.component';
import { SoundNavComponent } from './Components/SystemNavs/SoundNav/SoundNav.component';
import { CampaignManagementComponent } from './Components/SystemNavs/CampaignManagement/CampaignManagement.component';

export const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: 'campaign-management',
        component: CampaignManagementComponent,
      },
      { path: 'items', component: ItemsNavComponent },
      { path: 'systems', component: SystemNavComponent },
      { path: 'sound', component: SoundNavComponent },
      { path: 'campaign/:campaignId', component: CampaignNavComponent },
    ],
  },
];
