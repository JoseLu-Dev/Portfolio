import { LanguageService } from '../../services/language.service';
import { NightModeService } from '../../services/night-mode.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ComponentInScreenService } from '../services/component-in-screen.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  componentInScreen: string = '';

  showMenu = false;

  languageControl = new FormControl();

  constructor(
    private nightModeService: NightModeService,
    private languageService: LanguageService,
    private componentInScreenService: ComponentInScreenService) { 
      this.setOnComponentInScreenChange();
    }

  ngOnInit(): void {
    this.languageControl.setValue(this.getCurrentLanguage());
    this.languageControl.valueChanges.subscribe(language => {
      if (!language) { return; }
      this.setLanguageForUse(language);
    })
  }

  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }

  toggleNightMode() {
    this.nightModeService.toggleNightMode();
  }

  isNightModeActive() {
    return this.nightModeService.nightMode;
  }

  setLanguageForUse(language: string): void {
    this.languageService.setLanguageForUse(language);
  }

  getLanguages(): string[] {
    return this.languageService.getLanguages();
  }

  getCurrentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }

  setOnComponentInScreenChange(){
    this.componentInScreenService.getElementInScreen().subscribe(el =>{
      this.componentInScreen = el;
    });
  }

}
