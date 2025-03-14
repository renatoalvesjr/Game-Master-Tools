import { Component } from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";

@Component({
  selector: 'app-map-nav',
    imports: [
        SvgIconComponent
    ],
  templateUrl: './map-nav.component.html',
  styleUrl: './map-nav.component.scss'
})
export class MapNavComponent {
  mapsHidden: boolean = true;

}
