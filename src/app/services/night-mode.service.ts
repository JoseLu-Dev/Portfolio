import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NightModeService {

  public nightMode: boolean = false;

  constructor() { }

  toggleNightMode(){
    this.nightMode = !this.nightMode;
  }
}
