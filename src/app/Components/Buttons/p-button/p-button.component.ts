import { Attribute, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'p-button',
  standalone: true,
  imports: [],
  templateUrl: './p-button.component.html',
  styleUrl: './p-button.component.css',
})
export class PButtonComponent {
  @Input() title: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() autofocus: boolean = false;
  @Input() ariaLabel: string = '';
  @Output() buttonClick = new EventEmitter<MouseEvent>();
  @Output() buttonBlur = new EventEmitter<FocusEvent>();
  @Output() buttonFocus = new EventEmitter<FocusEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }

  onBlur(event: FocusEvent): void {
    this.buttonBlur.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.buttonFocus.emit(event);
  }
}
