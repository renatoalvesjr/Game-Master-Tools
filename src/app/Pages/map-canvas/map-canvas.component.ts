import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { MapService } from '../../Services/map.service';
import { MapPage } from '../../Types/MapPage.type';
import { MapCanvas, MapPin } from '../../Types/MapCanvas.type';
import { BreadcombComponent } from '../../Components/breadcomb/breadcomb.component';
import * as L from 'leaflet';
import { SvgIconComponent } from 'angular-svg-icon';
import { WindowRef } from '../../Services/window.service';
import { PButtonComponent } from '../../Components/Buttons/p-button/p-button.component';
import { Request } from '../../Types/Request.type';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { TranslatePipe } from '@ngx-translate/core';
import { NgStyle } from '@angular/common';
import { UtilsService } from '../../Services/utils.service';
import { NgxTiptapModule } from 'ngx-tiptap';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TooltipService } from '../../Services/tooltip.service';
import { TooltipType } from '../../Types/Tooltip.type';

interface Pin {
  id: string;
  name: string;
  url: string;
  type?: 'enemy' | 'npc' | 'treasure' | 'trap' | 'custom';
}

@Component({
  selector: 'app-map-canvas',
  imports: [
    BreadcombComponent,
    PButtonComponent,
    TranslatePipe,
    NgStyle,
    SvgIconComponent,
    NgxTiptapModule,
    ReactiveFormsModule,
  ],
  templateUrl: './map-canvas.component.html',
  styleUrl: './map-canvas.component.scss',
})
export class MapCanvasComponent implements OnInit {
  @Input() mapPage: MapPage | null = null;
  @Input() mapCanvas: MapCanvas | null = null;
  @Input() campaignId!: string | null;

  utils = inject(UtilsService);
  mapsService = inject(MapService);
  window = inject(WindowRef).getWindow();
  tooltip = inject(TooltipService);
  elementRef = inject(ElementRef);

  map: L.Map | null = null;
  pins: L.Marker[] = [];
  currentIconKey: 'red' | 'blue' = 'red';

  icons: Pin[] = [
    {
      id: this.utils.getUUID(),
      name: 'red',
      url: 'icons/red-pin.svg',
    },
    {
      id: this.utils.getUUID(),
      name: 'blue',
      url: 'icons/blue-pin.svg',
    },
    {
      id: this.utils.getUUID(),
      name: 'green',
      url: 'icons/green-pin.svg',
    },
    {
      id: this.utils.getUUID(),
      name: 'yellow',
      url: 'icons/yellow-pin.svg',
    },
  ];

  rightClickCoords: L.LatLng | null = null;
  showContextMenu = false;
  showPinContextMenu = false;
  showPinTooltip = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedMarker: string = '';
  selectedPin: string | null = null;
  selectedTooltip: TooltipType = {} as TooltipType;

  imageWidth = 0;
  imageHeight = 0;
  imageOverlay?: L.ImageOverlay;

  isEmpty: boolean = true;
  showPinMenu: boolean = false;

  tooltipForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  ngOnInit() {
    console.log('MapCanvasComponent initialized pre map load');
    if (this.mapCanvas?.mapContent?.base64) {
      this.isEmpty = false;
      this.setImage(this.mapCanvas.mapContent.base64);
    }
    console.log('MapCanvasComponent initialized after map load');
  }

  closeMenu(event?: Event, tooltip?: TooltipType) {
    console.log('event:', event);
    if (event) {
      event.stopPropagation();
    }
    if(this.showPinTooltip) {
    this.updateTooltip();
    }
    this.showContextMenu = false;
    this.showPinMenu = false;
    this.showPinContextMenu = false;
    this.showPinTooltip = false;
    this.selectedPin = '';
    if (tooltip) {
      this.tooltip
        .updateTooltip(
          this.campaignId!,
          this.mapPage!.mapPageId,
          this.mapCanvas!.mapId,
          tooltip,
        )
        .then(() => {});
    }

    this.tooltipForm.get('title')?.setValue('');
    this.tooltipForm.get('content')?.setValue('');
  }

  onMapRightClick(event: L.LeafletMouseEvent) {
    this.closeMenu();
    this.rightClickCoords = event.latlng;
    console.log(this.rightClickCoords);
    this.contextMenuPosition = {
      x: event.originalEvent.clientX,
      y: event.originalEvent.clientY,
    };
    this.showContextMenu = true;
  }

  onMapClick(event: L.LeafletMouseEvent) {
    this.closeMenu();
  }

  onPinRightClick(event: L.LeafletMouseEvent, marker: L.Marker) {
    this.closeMenu();
    this.contextMenuPosition = {
      x: event.originalEvent.clientX,
      y: event.originalEvent.clientY,
    };
    this.showPinContextMenu = true;
    this.selectedMarker = marker.options.attribution!;
  }

  async loadMap(imageBase64: string) {
    // Se o mapa já existir, remova-o antes de criar um novo
    if (this.map) this.map.remove();

    // Criação do mapa após a imagem ser carregada
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      center: [0, 0],
      zoom: -1,
      dragging: true,
      maxBounds: [
        [0, 0],
        [this.imageHeight, this.imageWidth],
      ], // Usando as dimensões da imagem
      maxBoundsViscosity: 1.0,
      maxZoom: 4,
      minZoom: -2,
      attributionControl: false,
    });

    this.map.on('contextmenu', this.onMapRightClick.bind(this));
    this.map.on('click', this.onMapClick.bind(this));

    // Adiciona a imagem sobre o mapa após o mapa ser carregado
    this.imageOverlay = L.imageOverlay(imageBase64, [
      [0, 0],
      [this.imageHeight, this.imageWidth],
    ]);
    this.imageOverlay.addTo(this.map);

    // Define os limites máximos do mapa
    this.map.setMaxBounds([
      [0, 0],
      [this.imageHeight, this.imageWidth],
    ]);

    // Atualiza o conteúdo do mapa se houver
    if (this.mapCanvas) {
      this.mapCanvas.mapContent = {
        base64: imageBase64,
        bounds: [
          [0, 0],
          [this.imageHeight, this.imageWidth],
        ],
        pins: this.mapCanvas.mapContent?.pins || [],
      };

      // Insert the icons
      this.mapCanvas.mapContent.pins.forEach((pin) => {
        const newIcon = L.icon({
          iconUrl: pin.url ? pin.url : 'icons/pin.svg',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
          attribution: pin.attribution,
        });
        const newMarker = L.marker(new L.LatLng(pin.x, pin.y), {
          icon: newIcon,
          draggable: true,
          attribution: pin.attribution,
          zIndexOffset: 200,
          riseOnHover: true,
          interactive: true,
        });
        newMarker.on('contextmenu', (event) => {
          this.onPinRightClick(event, newMarker);
        });
        newMarker.on('dblclick', (event) => {
          this.showTooltipModal(event, newMarker);
        });
        newMarker.on('move', async () => {
          pin.x = newMarker.getLatLng().lat;
          pin.y = newMarker.getLatLng().lng;
          this.mapCanvas!.mapContent!.pins =
            this.mapCanvas!.mapContent!.pins.map((p) => {
              if (p.attribution === pin.attribution) return pin;
              return p;
            });
          await this.updateMap(this.mapCanvas!);
        });
        this.pins.push(newMarker.addTo(this.map!));
      });

      const updatedMap: MapCanvas = {
        ...this.mapCanvas,
        mapContent: this.mapCanvas.mapContent,
      };
      await this.updateMap(updatedMap);
    }
  }


  async setPinTooltip(marker: L.Marker) {}

  async addPin(icon: Pin) {
    console.log(this.rightClickCoords);
    if (this.rightClickCoords) {
      const newIcon = L.icon({
        iconUrl: icon.url,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const newMarker = L.marker(this.rightClickCoords, {
        icon: newIcon,
        draggable: true,
        attribution: this.utils.getUUID(),
        zIndexOffset: 200,
        riseOnHover: true,
        interactive: true,
      });
      newMarker.on('contextmenu', (event) => {
        this.onPinRightClick(event, newMarker);
      });
      newMarker.on('mouseover', (event) => {
        this.showTooltipModal(event, newMarker);
      });
      newMarker.on('move', (latLang: LeafletEvent) => {
        newMarker.setLatLng(
          new L.LatLng(latLang.target._latlng.lat, latLang.target._latlng.lng),
        );
        this.mapCanvas!.mapContent!.pins.forEach((pin) => {
          if (pin.id === icon.id) {
            pin.x = latLang.target._latlng.lat;
            pin.y = latLang.target._latlng.lng;
          }
        });

        this.updateMap(this.mapCanvas!);
      });

      const newPin: MapPin = {
        id: icon.id,
        x: this.rightClickCoords.lat,
        y: this.rightClickCoords.lng,
        url: icon.url,
        label: icon.name,
        type: icon.type || 'custom',
        hasNote: false,
        attribution: newMarker.options.attribution,
      };
      this.mapCanvas!.mapContent!.pins.push(newPin);
      this.pins.push(newMarker.addTo(this.map!));
      await this.mapsService.updateMap(
        this.campaignId!,
        this.mapPage!.mapPageId,
        this.mapCanvas!,
      );
      await this.createTooltip(newMarker);
      this.closeMenu();
    }
    this.ngOnInit();
  }

  async removePin() {
    this.pins.forEach((pin) => {
      if (pin.options.attribution === this.selectedMarker) {
        this.map!.removeLayer(pin);
        this.pins = this.pins.filter(
          (p) => p.options.attribution !== this.selectedMarker,
        );
        this.mapCanvas!.mapContent!.pins =
          this.mapCanvas!.mapContent!.pins.filter(
            (p) => p.attribution !== this.selectedMarker,
          );
        this.updateMap(this.mapCanvas!);
        this.closeMenu();
      }
    });
  }

  async updateMap(map: MapCanvas) {
    await this.mapsService.updateMap(
      this.campaignId!,
      this.mapPage!.mapPageId,
      map,
    );
  }

  async onImageSelected() {
    try {
      const imagePath = await this.window.electronAPI.selectImage();

      const request: Request = {
        content: imagePath,
      };
      const imageBase64 =
        await this.window.electronAPI.readImageAsBase64(request);

      // Espera a imagem carregar para garantir que a sobreposição seja configurada corretamente
      await this.setImage(imageBase64);
      this.isEmpty = false;
    } catch (e) {
      console.error('Error on selecting a image: ', e);
    }
  }

  async setImage(imageBase64: string) {
    const img = new Image();

    img.onload = async () => {
      // Ao carregar a imagem, pega as dimensões dela
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      console.log(`Imagem carregada: ${this.imageWidth}, ${this.imageHeight}`);

      // Agora, chama loadMap para inicializar o mapa após a imagem estar carregada
      await this.loadMap(imageBase64);
    };

    img.onerror = () => {
      console.error('Erro ao carregar a imagem.');
    };

    // Define o src da imagem para começar o carregamento
    img.src = imageBase64;
  }

  async createTooltip(marker: L.Marker) {
    const newTooltip: TooltipType = {
      id: marker.getAttribution!()!,
      title: '',
      content: '',
      linkTo: '',
      creationDate: this.utils.getTimeNow(),
    };
    try {
      await this.tooltip.addTooltip(
        this.campaignId!,
        this.mapPage!.mapPageId,
        this.mapCanvas!.mapId,
        newTooltip,
      );
      return true;
    } catch (e) {
      console.error('Error on creating Tooltip: ', e);
      return false;
    }
  }

  
  async loadTooltips(marker: L.Marker) {
    
  }

  async showTooltipModal(event: LeafletMouseEvent, marker: L.Marker) {
    this.closeMenu();
    if (marker.getAttribution?.()) {
      
      console.log('Mouse click on pin: ', marker.getAttribution());
      this.selectedPin = marker.getAttribution()!;
      const tooltip: TooltipType = await this.tooltip.getTooltip(
        this.campaignId!,
        this.mapPage?.mapPageId!,
        this.mapCanvas?.mapId!,
        this.selectedPin!,
      );
      
      

      this.showPinTooltip = true;
      this.selectedTooltip = await this.tooltip.getTooltip(
        this.campaignId!,
        this.mapPage!.mapPageId,
        this.mapCanvas!.mapId,
        this.selectedPin,
      );
      console.log(tooltip);
      
      this.tooltipForm.get('content')?.setValue(this.selectedTooltip.content);
      this.tooltipForm.get('title')?.setValue(this.selectedTooltip.title);    
    }
  }


  async updateTooltip() {
    const tooltipId = this.selectedPin;
    const title = this.tooltipForm.get('title')?.value;
    const content = this.tooltipForm.get('content')?.value;
    try {

      const tooltip: TooltipType = await this.tooltip.getTooltip(
        this.campaignId!,
        this.mapPage?.mapPageId!,
        this.mapCanvas?.mapId!,
        tooltipId!,
      );

      tooltip.title = title!;
      tooltip.content = content!;

      await this.tooltip.updateTooltip(
        this.campaignId!,
        this.mapPage?.mapPageId!,
        this.mapCanvas?.mapId!,
        tooltip,
      );
    } catch (e) {
      console.error('Error on updating tooltip: ', e);
    }
  }

  async deleteTooltip(marker: L.Marker) {
    await this.tooltip.deleteTooltip(
      this.campaignId!,
        this.mapPage?.mapPageId!,
        this.mapCanvas?.mapId!,
        this.selectedMarker
    )
  }

  protected readonly close = close;
  protected readonly event = event;
}
