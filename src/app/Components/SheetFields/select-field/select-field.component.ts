import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-field',
  imports: [],
  templateUrl: 'select-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFieldComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() options: string[] = [];
  @Input() defaultValue: string = '';
}
