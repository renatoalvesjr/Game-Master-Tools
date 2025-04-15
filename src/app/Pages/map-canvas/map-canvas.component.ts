import {Component, inject, Input} from '@angular/core';
import {MapService} from '../../Services/map.service';
import {MapPage} from '../../Types/MapPage.type';
import {MapCanvas} from '../../Types/MapCanvas.type';
import {BreadcombComponent} from '../../Components/breadcomb/breadcomb.component';
import * as L from 'leaflet';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-map-canvas',
  imports: [
    BreadcombComponent,
    SvgIconComponent
  ],
  templateUrl: './map-canvas.component.html',
  styleUrl: './map-canvas.component.scss'
})
export class MapCanvasComponent {

  @Input() mapPage: MapPage | null = null;
  @Input() mapCanvas: MapCanvas | null = null;
  @Input() campaignId!: string | null;

  mapsService = inject(MapService)

  private map!: L.Map;
  private pins: L.Marker[] = [];
  private currentIconKey: 'red' | 'blue' = 'red';

  private imageWidth = 9800;
  private imageHeight = 6798;

  private pinIcons: Record<string, L.DivIcon> = {
    blue: L.icon({ iconUrl: 'icons/blue-pin.svg', iconSize: [32, 32], iconAnchor: [16, 32], className: '' }),
    red: L.icon({ iconUrl: 'icons/red-pin.svg', iconSize: [32, 32], iconAnchor: [16, 32], className: '' }),
    // ...mais 3 estilos
  };

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const bounds: L.LatLngBoundsExpression = [[0, 0], [this.imageHeight, this.imageWidth]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -4,
      maxZoom: 2,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
      attributionControl: false
    });

    L.imageOverlay('https://i.ibb.co/dgYvsZ7/Faerun-Map-Redone-Roll-20-Res-Hexes.jpg', bounds).addTo(this.map);
    this.map.fitBounds(bounds);

    // 🖱️ Clique para adicionar pin
    this.map.on('click', (e: L.LeafletMouseEvent) => this.addPin(e.latlng));
  }

  private addPin(latlng: L.LatLng): void {
    const icon = this.pinIcons[this.currentIconKey];
    const marker = L.marker(latlng, { icon }).addTo(this.map);

    // Clique no pin remove ele
    marker.on('click', () => {
      this.map.removeLayer(marker);
      this.pins = this.pins.filter(p => p !== marker);
    });

    this.pins.push(marker);
  }

  // Botão para trocar estilo de ícone
  setIconStyle(style: 'red' | 'blue') {
    this.currentIconKey = style;
  }

  // Remove todos os pins
  clearPins() {
    this.pins.forEach(pin => this.map.removeLayer(pin));
    this.pins = [];
  }
}
