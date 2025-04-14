import {Component, Input} from '@angular/core';
import {Page} from "../../Types/Page.type";
import {NgStyle} from '@angular/common';
import {MapPage} from '../../Types/MapPage.type';

@Component({
  selector: 'app-color-selection',
  imports: [
    NgStyle
  ],
  templateUrl: './color-selection.component.html',
  styleUrl: './color-selection.component.scss'
})
export class ColorSelectionComponent {
  @Input() pageColors: string[] = [];
  @Input() changeColor!: (page: any, color: string) => Promise<void>;
  @Input() page!: MapPage | Page;
}
