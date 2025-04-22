import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'app-SoundNav',
    templateUrl: './SoundNav.component.html',
    styleUrls: ['./SoundNav.component.css'],
    standalone: true,
    imports: [
        TranslatePipe
    ]
})
export class SoundNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
