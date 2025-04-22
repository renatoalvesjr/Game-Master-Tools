import {Component, Input} from '@angular/core';
import {SvgIconComponent} from 'angular-svg-icon';
import {SystemNavList} from '../../Types/SystemNavList.type';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-nav-main-menu-item',
  imports: [
    SvgIconComponent,
    TranslatePipe
  ],
  templateUrl: './nav-main-menu.component.html',
  styleUrl: './nav-main-menu.component.scss'
})
export class NavMainMenuComponent {

  @Input() item: SystemNavList | null = null;
}
