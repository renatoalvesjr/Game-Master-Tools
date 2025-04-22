import {Component, inject} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfigService} from '../../Services/config.service';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-settings',
  imports: [TranslateModule, ReactiveFormsModule, FormsModule, SvgIconComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  configService = inject(ConfigService)

  constructor(protected translate: TranslateService) {
    this.translate.use(this.translate.currentLang)
  }

  async changeLanguage(event: Event) {
    const selectElement = event.target as HTMLSelectElement
    this.translate.use(selectElement.value);
    await this.configService.changeLanguage(selectElement.value);
  }

  async changeTheme(theme: 'light' | 'dark' | 'system') {
    await this.configService.changeColorMode(theme);
  }
}
