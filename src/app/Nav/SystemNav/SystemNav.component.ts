import { Component, OnInit } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import { SettingsComponent } from "../../Pages/System/system.component";

@Component({
    selector: 'app-SystemNav',
    templateUrl: './SystemNav.component.html',
    styleUrls: ['./SystemNav.component.css'],
    standalone: true,
    imports: [
    TranslatePipe,
    SettingsComponent
]
})
export class SystemNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
