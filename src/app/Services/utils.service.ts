import { Injectable } from '@angular/core';

// noinspection SpellCheckingInspection
@Injectable({
  providedIn: 'platform'
})
export class UtilsService {

  constructor() {
  }
  getTimeNow(): string {
    return new Date().toISOString();
  }
  getUUID(): string{

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
