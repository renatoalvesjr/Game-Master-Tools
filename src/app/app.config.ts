import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, RouteReuseStrategy, withDebugTracing, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes,
      withRouterConfig({onSameUrlNavigation: 'reload'}),
      withRouterConfig({paramsInheritanceStrategy: 'always'}),
      withRouterConfig({urlUpdateStrategy: 'eager'}),
      withRouterConfig({defaultQueryParamsHandling: 'merge'}),
    ),
    provideAnimations(),
  ],
};
