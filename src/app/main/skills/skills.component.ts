import { NightModeService } from './../../services/night-mode.service';
import { SkillsService } from './skills.service';
import { Component, OnInit } from '@angular/core';

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
    ) { }

  ngOnInit(): void {
    this.getSkills();
  }

  getSkills() {
    return this.skillsService.getSkills().subscribe(res =>{
      console.log(res)
      this.skillsTypes = res;
    });
  }

  getSkillIcon(iconName: string) {
    return this.skillsService.getSkillIconUrl(iconName);
  }

  getSkillTypeIcon(iconName: string) {
    console.log(this.skillsService.getSkillTypeIconUrl(iconName, this.nightModeService.nightMode))
    return this.skillsService.getSkillTypeIconUrl(iconName, this.nightModeService.nightMode);
  }

}
