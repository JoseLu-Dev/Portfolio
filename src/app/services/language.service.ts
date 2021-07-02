import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translateService: TranslateService) { 
    this.configureTranslateService();
  }

  configureTranslateService(){
    this.translateService.addLangs(['en', 'es']);
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  getLanguages(): string[] {
    return this.translateService.getLangs();
  }

  setLanguageForUse(language: string): void {
    this.translateService.use(language);
  }

  getCurrentLanguage(): string{
    return this.translateService.currentLang;
  }
}
