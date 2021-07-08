import { NightModeService } from './../../services/night-mode.service';
import { environment } from './../../../environments/environment.prod';
import { Repo } from './repo-model';
import { Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any;

  constructor(
    private projectService: ProjectsService,
    private nightModeService: NightModeService) { }

  ngOnInit(): void {
    this.getProjectsData();
  }

  getProjectsData(): void{
    this.projectService.getUserRepos().subscribe(projects =>{
      projects.sort((first: Repo, second: Repo) =>{return first.stargazers_count > second.stargazers_count ? -1 : 1})
      this.projects = projects;
      console.log(projects)
    })
  }

  getUserGithubName(): string{
    return environment.githubUserName;
  }

  getUserRepoLogo(): string{
    return this.projectService.getUserRepoBrandImage(this.nightModeService.nightMode);
  }
}
