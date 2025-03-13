import {
  ApplicationConfig, importProvidersFrom, provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {initializeApp} from './appInitializer';
import {CampaignService} from './Services/campaign.service';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    provideAngularSvgIcon(),
    provideAnimations(),
    CampaignService,
    provideAppInitializer(initializeApp),
    provideRouter(routes,
      withRouterConfig({onSameUrlNavigation: 'reload'}),
      withRouterConfig({paramsInheritanceStrategy: 'always'}),
      withRouterConfig({urlUpdateStrategy: 'eager'}),
      withRouterConfig({defaultQueryParamsHandling: 'merge'}),
    ),
  ],
};
