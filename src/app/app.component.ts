import { Component } from '@angular/core';
import { NightModeService } from './services/night-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio';

  constructor(private nightModeService: NightModeService){}

  isNightModeActive(){
    return this.nightModeService.nightMode;
  }
}
