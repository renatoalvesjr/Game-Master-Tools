import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-boolan-field',
  imports: [],
  templateUrl: 'boolean-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooleanFieldComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() checked: boolean = false;
}
