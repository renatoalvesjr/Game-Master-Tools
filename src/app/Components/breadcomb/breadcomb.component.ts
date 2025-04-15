import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-breadcomb',
  imports: [],
  templateUrl: './breadcomb.component.html',
  styleUrl: './breadcomb.component.scss'
})
export class BreadcombComponent {
  @Input() list: string[] = [];
  index!: number;
}
