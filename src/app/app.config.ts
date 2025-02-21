import {
  ApplicationConfig, provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {initializeApp} from './appInitializer';
import {CampaignService} from './Services/campaign.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimations(),
    provideRouter(routes,
      withRouterConfig({onSameUrlNavigation: 'reload'}),
      withRouterConfig({paramsInheritanceStrategy: 'always'}),
      withRouterConfig({urlUpdateStrategy: 'eager'}),
      withRouterConfig({defaultQueryParamsHandling: 'merge'}),
    ),
    CampaignService,
    provideAppInitializer(initializeApp)
  ],
};
