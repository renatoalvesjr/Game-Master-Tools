import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindowRef {
  getWindow(): any {
    return window;
  }
  constructor() { }
  get nativeWindow(): Window{
    return this.getWindow();
  }
}
