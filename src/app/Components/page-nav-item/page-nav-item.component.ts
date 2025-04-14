import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Page} from "../../Types/Page.type";
import {SvgIconComponent} from 'angular-svg-icon';
import {NgStyle} from '@angular/common';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-page-nav-item',
  imports: [
    SvgIconComponent,
    NgStyle,
    MatMenuTrigger
  ],
  templateUrl: './page-nav-item.component.html',
  styleUrl: './page-nav-item.component.scss'
})
export class PageNavItemComponent {

  @Input() page: Page | null = null;
  @Input() pageMenu: MatMenu | null = null;
  @Output() togglePage: EventEmitter<Page> = new EventEmitter<Page>();
}
