import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  DND_TEMPLATE,
  SystemTemplate,
} from '../../Types/SystemTemplate.type';
import { UtilsService } from '../../Services/utils.service';

@Component({
  selector: 'app-template-viewer',
  imports: [],
  templateUrl: './template-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateViewerComponent {
  utils = inject(UtilsService);

  @Input() selectedTemplate: SystemTemplate = DND_TEMPLATE;

  testTemplate: SystemTemplate = DND_TEMPLATE;

}
