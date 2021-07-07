import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  skillsUrl: string = `${environment.githubUserRepoUrl}/skills.json`;
  skillsIconsUrl: string = `${environment.githubUserRepoUrl}/resources/icons/skills-icons`
  skillsTypesIconsUrl: string = `${environment.githubUserRepoUrl}/resources/icons/types-icons`

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
