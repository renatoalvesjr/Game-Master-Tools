import { Component } from '@angular/core';
import {SvgIconComponent} from "angular-svg-icon";

@Component({
  selector: 'app-creatures-nav',
    imports: [
        SvgIconComponent
    ],
  templateUrl: './creatures-nav.component.html',
  styleUrl: './creatures-nav.component.scss'
})
export class CreaturesNavComponent {
  creaturesHidden = true

}
