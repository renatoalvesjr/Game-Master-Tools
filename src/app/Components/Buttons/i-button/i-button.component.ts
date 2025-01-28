import { Component, Input } from '@angular/core';

@Component({
  selector: 'i-button',
  standalone: true,
  imports: [],
  templateUrl: './i-button.component.html',
  styleUrl: './i-button.component.css',
})
export class IButtonComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
}
