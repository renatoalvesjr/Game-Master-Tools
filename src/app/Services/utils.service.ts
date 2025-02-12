import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'platform'
})
export class UtilsService {

  constructor() {
  }
  getTimeNow(): string {
    return new Date().toISOString();
  }

}
