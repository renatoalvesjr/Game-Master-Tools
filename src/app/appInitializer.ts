import {ConfigService} from './Services/config.service';
import {inject} from '@angular/core';

export async function initializeApp() {
  const configService: ConfigService = inject(ConfigService);
  await configService.loadConfig();

}
