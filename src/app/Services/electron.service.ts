import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  isElectron = !!window.electronAPI;

  openExternal(url: string): void {
    if (this.isElectron) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }
  constructor() {}
}
