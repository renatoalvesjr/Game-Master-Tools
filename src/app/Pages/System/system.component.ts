import {Component, inject} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConfigService} from '../../Services/config.service';
import {SvgIconComponent} from 'angular-svg-icon';
import { TemplateCreatorComponent } from "../../Components/template-creator/template-creator.component";

@Component({
  selector: 'app-system',
  imports: [TemplateCreatorComponent],
  templateUrl: './system.component.html',
})
export class SettingsComponent {

}
