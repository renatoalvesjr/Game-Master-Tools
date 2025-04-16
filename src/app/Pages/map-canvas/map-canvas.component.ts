import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MapService} from '../../Services/map.service';
import {MapPage} from '../../Types/MapPage.type';
import {MapCanvas} from '../../Types/MapCanvas.type';
import {BreadcombComponent} from '../../Components/breadcomb/breadcomb.component';
import * as L from 'leaflet';
import {SvgIconComponent} from 'angular-svg-icon';
import {WindowRef} from '../../Services/window.service';
import {PButtonComponent} from '../../Components/Buttons/p-button/p-button.component';
import {Request} from '../../Types/Request.type'
import {ImageOverlay} from 'leaflet';
import {TranslatePipe} from '@ngx-translate/core';
import {NgStyle} from '@angular/common';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-map-canvas',
  imports: [
    BreadcombComponent,
    PButtonComponent,
    TranslatePipe,
    NgStyle,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatButton,
    SvgIconComponent
  ],
  templateUrl: './map-canvas.component.html',
  styleUrl: './map-canvas.component.scss'
})
export class MapCanvasComponent implements OnInit {

  @Input() mapPage: MapPage | null = null;
  @Input() mapCanvas: MapCanvas | null = null;
  @Input() campaignId!: string | null;

  mapsService = inject(MapService);
  window = inject(WindowRef).getWindow();
  elementRef = inject(ElementRef);

  map: L.Map | null = null;
  pins: L.Marker[] = [];
  currentIconKey: 'red' | 'blue' = 'red';

  rightClickCoords: L.LatLng | null = null;
  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  imageWidth = 0;
  imageHeight = 0;
  imageOverlay?: L.ImageOverlay;

  isEmpty: boolean = true;
  showPinMenu: boolean = false;

  async ngOnInit() {
    console.log("MapCanvasComponent initialized pre map load");
    if(this.mapCanvas?.mapContent?.base64){
      this.isEmpty = false;
      this.setImage(this.mapCanvas.mapContent.base64);

    }
    console.log("MapCanvasComponent initialized after map load");
  }

  closeMenu() {
    this.showContextMenu = false
    console.log("Bye Bye...")
  }

  onMapRightClick(event: L.LeafletMouseEvent) {
    this.rightClickCoords = event.latlng;
    console.log(this.rightClickCoords)
    this.contextMenuPosition = {
      x: event.originalEvent.clientX,
      y: event.originalEvent.clientY
    };
    this.showContextMenu = true;
  }

  addPin(){
    if(this.rightClickCoords){
      console.log(this.rightClickCoords)
    }
  }

  loadMap(imageBase64: string) {
    // Se o mapa já existir, remova-o antes de criar um novo
    if (this.map) this.map.remove();

    // Criação do mapa após a imagem ser carregada
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      center: [0, 0],
      zoom: -1,
      dragging: true,
      maxBounds: [[0, 0], [this.imageHeight, this.imageWidth]], // Usando as dimensões da imagem
      maxBoundsViscosity: 1.0,
      maxZoom: 4,
      minZoom: -2,
      attributionControl: false
    });

    this.map.on('contextmenu', this.onMapRightClick.bind(this))

    // Adiciona a imagem sobre o mapa após o mapa ser carregado
    this.imageOverlay = L.imageOverlay(imageBase64, [[0, 0], [this.imageHeight, this.imageWidth]]);
    this.imageOverlay.addTo(this.map);

    // Define os limites máximos do mapa
    this.map.setMaxBounds([[0, 0], [this.imageHeight, this.imageWidth]]);

    // Atualiza o conteúdo do mapa se houver
    if (this.mapCanvas) {
      this.mapCanvas.mapContent = {
        base64: imageBase64,
        bounds: [[0, 0], [this.imageHeight, this.imageWidth]],
        pins: this.mapCanvas.mapContent?.pins || []
      };
      const updatedMap: MapCanvas = {...this.mapCanvas, mapContent: this.mapCanvas.mapContent};
      this.mapsService.updateMap(this.campaignId!, this.mapPage!.mapPageId, updatedMap);
    }
  }

  async onImageSelected() {
    try {
      const imagePath = await this.window.electronAPI.selectImage();

      const request: Request = {
        content: imagePath
      }
      const imageBase64 = await this.window.electronAPI.readImageAsBase64(request);

      // Espera a imagem carregar para garantir que a sobreposição seja configurada corretamente
      this.setImage(imageBase64);
      this.isEmpty = false;
    } catch (e) {
      console.error("Error on selecting a image: ", e);
    }
  }

  setImage(imageBase64: string) {
    const img = new Image();

    img.onload = () => {
      // Ao carregar a imagem, pega as dimensões dela
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      console.log(`Imagem carregada: ${this.imageWidth}, ${this.imageHeight}`);

      // Agora, chama loadMap para inicializar o mapa após a imagem estar carregada
      this.loadMap(imageBase64);
    };

    img.onerror = () => {
      console.error("Erro ao carregar a imagem.");
    };

    // Define o src da imagem para começar o carregamento
    img.src = imageBase64;
  }

}
