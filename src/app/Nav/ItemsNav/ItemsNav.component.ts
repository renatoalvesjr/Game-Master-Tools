import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-ItemsNav',
  templateUrl: './ItemsNav.component.html',
  styleUrls: ['./ItemsNav.component.css'],
  standalone: true,
  imports: [
    TranslatePipe
  ]
})
export class ItemsNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
