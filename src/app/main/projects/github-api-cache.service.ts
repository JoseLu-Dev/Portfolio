import { Injectable } from '@angular/core';
import { take, map, switchMap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Repo } from './repo-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubApiCacheService {

  userReposStorageKey: string = 'userRepos';
  repoTopicsStorageKey: string = 'repoTopics_';
  repoImagesStorageKey: string = 'repoImages_';

  userReposUrl: string = `${environment.githubAPIUrl}/users/${environment.githubUserName}/repos`;

  constructor(private http: HttpClient) { }

  getUserRepos(): Observable<Repo[]> {
    let modifiedSince = true;
    const userRepos: ObjectWrapper = this.getObjectSaved(this.userReposStorageKey);

    const headers: HttpHeaders = new HttpHeaders()
    if (userRepos) { headers.append('If-Modified-Since', userRepos.dateSaved.toISOString()); }

    return this.http.get<Repo[]>(this.userReposUrl, { headers: headers })
      .pipe(
        catchError((error: any) => {
          const errorStatusCode = error['status'];
          switch (errorStatusCode) {
            case 304:
              modifiedSince = false;
          }
          return of(error);
        }),
        map(res => {
          if (!modifiedSince) { res = userRepos }
          else {
            const objectWrapper = new ObjectWrapper();
            objectWrapper.object = res;
            this.saveObject(this.userReposStorageKey, objectWrapper)
          }
          return res;
        })
      );
  }

  getRepoTopics(repoName: string) {

    let modifiedSince = true;
    const repoTopics: ObjectWrapper = this.getObjectSaved(`${this.repoTopicsStorageKey}${repoName}`);

    const headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.mercy-preview+json')
    if (repoTopics) { headers.append('If-Modified-Since', repoTopics.dateSaved.toISOString()); }

    return this.http.get(
      `${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/topics`,
      { headers: headers }
    ).pipe(
      catchError((error: any) => {
        const errorStatusCode = error['status'];
        switch (errorStatusCode) {
          case 304:
            modifiedSince = false;
        }
        return of(error);
      }),
      map(res => {
        if (!modifiedSince) { res = repoTopics }
        else {
          const objectWrapper = new ObjectWrapper();
          objectWrapper.object = res;
          this.saveObject(`${this.repoTopicsStorageKey}${repoName}`, objectWrapper)
        }
        return res;
      })
    );
  }

  getRepoImages(repoName: string) {
    let modifiedSince = true;
    const repoImages: ObjectWrapper = this.getObjectSaved(`${this.repoImagesStorageKey}${repoName}`);

    const headers: HttpHeaders = new HttpHeaders()
    if (repoImages) { headers.append('If-Modified-Since', repoImages.dateSaved.toISOString()); }

    return this.http.get(`${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/contents/resources/images`,
    )
      .pipe(
        catchError((error: any) => {
          const errorStatusCode = error['status'];
          switch (errorStatusCode) {
            case 304:
              modifiedSince = false;
          }
          return of(error);
        }),
        map(res => {
          if (!modifiedSince) { res = repoImages }
          else {
            const objectWrapper = new ObjectWrapper();
            objectWrapper.object = res;
            this.saveObject(`${this.repoImagesStorageKey}${repoName}`, objectWrapper)
          }
          return res;
        })
      );
  }

  getObjectSaved(id: string): ObjectWrapper {
    return ObjectWrapper.fromJSON(JSON.parse(localStorage.getItem(id) as string));
  }

  saveObject(id: string, object: ObjectWrapper) {
    localStorage.setItem(id, JSON.stringify(object));
  }

}

export class ObjectWrapper {
  dateSaved: Date = new Date();
  object: any;

  static fromJSON(wrapperJson: any): ObjectWrapper {
    if (!wrapperJson) { return new ObjectWrapper(); }

    const objectWrapper: ObjectWrapper = new ObjectWrapper();
    objectWrapper.dateSaved = new Date(wrapperJson.dateSaved);
    objectWrapper.object = wrapperJson.object;

    return objectWrapper;
  }
}
