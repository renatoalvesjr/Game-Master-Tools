import { Component } from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";

@Component({
  selector: 'app-item-nav',
    imports: [
        SvgIconComponent
    ],
  templateUrl: './item-nav.component.html',
  styleUrl: './item-nav.component.scss'
})
export class ItemNavComponent {
  itemsHidden = true
}
