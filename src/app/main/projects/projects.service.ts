import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable, of } from 'rxjs';
import { GithubApiCacheService } from './github-api-cache.service';
import { Injectable } from '@angular/core';
import { Repo } from './repo-model';
import { map, catchError } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private githubApiCacheService: GithubApiCacheService,
    private http: HttpClient,
    private languageService: LanguageService) { }

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
            this.languageService.getLanguages().forEach(language => {
              this.getRepoDescription(repo.name, language).subscribe(text => {
                setKeyValue(language, repo, text);
              })
            })
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

  getRepoDescription(repoName: string, language: string) {
    return this.http.get(`${environment.githubRawContentUrl}/${environment.githubUserName}/${repoName}/master/resources/text/${language}.json`)
      .pipe(
        catchError((err) => {
          const errorStatusCode = err['status'];
          if (errorStatusCode === 404) {
            return this.http.get(`${environment.githubRawContentUrl}/${environment.githubUserName}/${repoName}/master/resources/text/${language}.json`);
          }
          return of(err)
        }
        )
      );
  }
}

const setKeyValue = (key: string, obj: Record<string, any>, value: any) => obj[key] = value;
