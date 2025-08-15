import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-field',
  imports: [],
  templateUrl: 'number-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFieldComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() content: string = '';
}
