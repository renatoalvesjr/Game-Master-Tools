import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-field',
  imports: [],
  templateUrl: 'text-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent {
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() content: string = '';
}
