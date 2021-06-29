import { NightModeService } from './../../services/night-mode.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  showMenu = false;

  constructor(private nightModeService: NightModeService) { }

  ngOnInit(): void {
  }

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }

  toggleNightMode(){
    this.nightModeService.toggleNightMode();
  }
}
