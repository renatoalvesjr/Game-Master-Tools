import { Component, Input } from '@angular/core';

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
}
