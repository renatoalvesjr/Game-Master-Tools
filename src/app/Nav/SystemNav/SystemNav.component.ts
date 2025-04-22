import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-SystemNav',
    templateUrl: './SystemNav.component.html',
    styleUrls: ['./SystemNav.component.css'],
    standalone: true,
    imports: [
        TranslatePipe
    ]
})
export class SystemNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
