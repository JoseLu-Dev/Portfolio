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
              console.log(imagesUrl)
              repo.imagesUrl = imagesUrl;
            });
            this.getRepoTopics(repo.name).subscribe(topics => {
              repo.topics = topics;
            });
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
}
