import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Page} from '../../Types/Page.type';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {MapPage} from '../../Types/MapPage.type';
import {SvgIconComponent} from 'angular-svg-icon';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-map-nav-item',
  imports: [
    SvgIconComponent,
    MatMenuTrigger,
    NgStyle
  ],
  templateUrl: './map-nav-item.component.html',
  styleUrl: './map-nav-item.component.scss'
})
export class MapNavItemComponent {
  @Input() mapPage: MapPage | null = null;
  @Input() mapPageMenu: MatMenu | null = null;
  @Output() toggleMapPage: EventEmitter<MapPage> = new EventEmitter<MapPage>();
}
