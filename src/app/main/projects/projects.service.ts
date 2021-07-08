import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { GithubApiCacheService } from './github-api-cache.service';
import { Injectable } from '@angular/core';
import { Repo } from './repo-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(private githubApiCacheService: GithubApiCacheService) { }

  getUserRepos(): Observable<Repo[]> {
    return this.githubApiCacheService.getUserRepos()
      .pipe(
        map(repos => {
          repos.forEach(repo => {
            this.getRepoImages(repo.name).subscribe(imagesUrl => {
              repo.imagesUrl = imagesUrl;
            });
            this.getRepoTopics(repo.name).subscribe(topics => {
              repo.topics = topics;
            });
            if (repo.name.localeCompare(environment.githubUserName, undefined, { sensitivity: 'base' })) {
              this.githubApiCacheService.getRepoBrandImage(repo.name, (url) => {
                repo.presentationImage = url;
              });
            }
          })
          return repos;
        })
      );
  }

  getRepoTopics(repoName: string): Observable<string[]> {
    return this.githubApiCacheService.getRepoTopics(repoName);
  }

  getRepoImages(repoName: string): Observable<string[]> {
    return this.githubApiCacheService.getRepoImages(repoName);
  }

  getUserRepoBrandImage(darkMode: boolean): string {
    let url = `${environment.githubRawContentUrl}/${environment.githubUserName}/${environment.githubUserName}/master/resources/logo-`;
    if (darkMode) { url += 'dark.png' } else { url += 'light.png' }
    return url;
  }
}
