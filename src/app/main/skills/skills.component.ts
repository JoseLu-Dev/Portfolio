import { NightModeService } from './../../services/night-mode.service';
import { SkillsService } from './skills.service';
import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  public skillsTypes = new Array();

  constructor(
    private skillsService: SkillsService,
    private nightModeService: NightModeService,
    private languageService: LanguageService
    ) { }

  ngOnInit(): void {
    this.getSkills();
  }

  getSkills() {
    return this.skillsService.getSkills().subscribe(res =>{
      this.skillsTypes = res['skills'];
    });
  }

  getSkillIcon(iconName: string) {
    return this.skillsService.getSkillIconUrl(iconName);
  }

  getSkillTypeIcon(iconName: string) {
    return this.skillsService.getSkillTypeIconUrl(iconName, this.nightModeService.nightMode);
  }

  getCurrentLanguage(): string{
    return this.languageService.getCurrentLanguage();
  }

}
