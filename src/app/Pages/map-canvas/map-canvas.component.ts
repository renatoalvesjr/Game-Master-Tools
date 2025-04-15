import {Component, inject, Input} from '@angular/core';
import {MapService} from '../../Services/map.service';
import {Note} from '../../Types/Note.type';
import {Page} from '../../Types/Page.type';
import {MapPage} from '../../Types/MapPage.type';
import {MapCanvas} from '../../Types/MapCanvas.type';
import {BreadcombComponent} from '../../Components/breadcomb/breadcomb.component';

@Component({
  selector: 'app-map-canvas',
  imports: [
    BreadcombComponent
  ],
  templateUrl: './map-canvas.component.html',
  styleUrl: './map-canvas.component.scss'
})
export class MapCanvasComponent {

  @Input() mapPage: MapPage | null = null;
  @Input() map: MapCanvas | null = null;
  @Input() campaignId!: string | null;

  mapsService = inject(MapService)
}
