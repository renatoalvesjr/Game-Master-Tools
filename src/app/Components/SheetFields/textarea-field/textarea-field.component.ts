import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-textarea-field',
  imports: [CommonModule],
  templateUrl: 'textarea-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFieldComponent {
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() value: string = '';
}
