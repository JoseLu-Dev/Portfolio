import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  skillsUrl: string = `${environment.githubRepoUrl}/skills.json`;
  skillsIconsUrl: string = `${environment.githubRepoUrl}/icons/skills-icons`
  skillsTypesIconsUrl: string = `${environment.githubRepoUrl}/icons/types-icons`

  constructor(private http: HttpClient) { }

  getSkills(): Observable<any>{
    return this.http.get(this.skillsUrl);
  }

  getSkillIconUrl(iconName: string): string {
    return `${this.skillsIconsUrl}/${iconName}.svg`;
  }

  getSkillTypeIconUrl(iconName: string, nightMode: boolean): string {
    return `${this.skillsTypesIconsUrl}/${iconName}_${nightMode ? 'white' : 'black'}.svg`;
  }

}
