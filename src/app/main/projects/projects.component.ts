import { map, take } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language.service';
import { NightModeService } from './../../services/night-mode.service';
import { environment } from './../../../environments/environment.prod';
import { Repo } from './repo-model';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';

import SwiperCore, {
  Autoplay,
  Pagination,
} from 'swiper/core';

SwiperCore.use([Autoplay, Pagination])

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any;

  constructor(
    private projectService: ProjectsService,
    private nightModeService: NightModeService,
    private languageService: LanguageService) { }

  ngOnInit(): void {
    this.getProjectsData();
  }

  getProjectsData(): void {
    this.projectService.getUserRepos().subscribe(projects => {
      projects.sort((first: Repo, second: Repo) => { return first.stargazers_count > second.stargazers_count ? -1 : 1 })
      this.projects = projects;
    })
  }

  getUserGithubName(): string {
    return environment.githubUserName;
  }

  getUserRepoLogo(): string {
    return this.projectService.getUserRepoBrandImage(this.nightModeService.nightMode);
  }

  getRepoDescription(repo: any) {
    return repo[this.languageService.getCurrentLanguage()]?.description;
  }
}
