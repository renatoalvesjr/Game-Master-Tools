import {Routes} from '@angular/router';
import {NavigationComponent} from './Components/Navigation/Navigation.component';
import {CampaignNavComponent} from './Components/SystemNavs/CampaignNav/CampaignNav.component';
import {ItemsNavComponent} from './Components/SystemNavs/ItemsNav/ItemsNav.component';
import {SystemNavComponent} from './Components/SystemNavs/SystemNav/SystemNav.component';
import {SoundNavComponent} from './Components/SystemNavs/SoundNav/SoundNav.component';
import {CampaignManagementComponent} from './Components/SystemNavs/CampaignManagement/CampaignManagement.component';
import {SettingsComponent} from './Pages/settings/settings.component';
import {InfoComponent} from './Pages/info/info.component';
import {HomeComponent} from './Pages/home/home.component';
import {NoteEditorComponent} from './Pages/Editor/Editor.component';
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
        children: [
          {path: 'page/:pageId/note/:noteId', component: NoteEditorComponent},
        ]
      },
    ],
  },
];
