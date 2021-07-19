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
    const userRepos: ObjectWrapper = this.getObjectSaved(this.userReposStorageKey);

    if (userRepos.object && userRepos.dateSaved && userRepos.dateSaved.getTime() > new Date().setHours(new Date().getHours() - 1)) {
      return of(userRepos.object);
    }

    return this.http.get<Repo[]>(this.userReposUrl)
      .pipe(
        map(res => {
          const objectWrapper = new ObjectWrapper();
          objectWrapper.object = res;
          this.saveObject(this.userReposStorageKey, objectWrapper)

          return res;
        })
      );
  }

  getRepoTopics(repoName: string) {
    const repoTopics: ObjectWrapper = this.getObjectSaved(`${this.repoTopicsStorageKey}${repoName}`);

    if (repoTopics.object && repoTopics.dateSaved && repoTopics.dateSaved.getTime() > new Date().setHours(new Date().getHours() - 1)) {
      return of(repoTopics.object);
    }

    let headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.mercy-preview+json')

    return this.http.get(
      `${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/topics`, { headers: headers }
    ).pipe(
      map(res => {
        const objectWrapper = new ObjectWrapper();
        objectWrapper.object = res;
        this.saveObject(`${this.repoTopicsStorageKey}${repoName}`, objectWrapper)

        return res;
      })
    );
  }

  getRepoImages(repoName: string) {
    const repoImages: ObjectWrapper = this.getObjectSaved(`${this.repoImagesStorageKey}${repoName}`);

    if (repoImages.dateSaved && repoImages.dateSaved.getTime() > new Date().setHours(new Date().getHours() - 1)) {
      return of(repoImages.object);
    }

    return this.http.get(
      `${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/contents/resources/images`,
    )
      .pipe(
        catchError(error => {
          const errorStatusCode = error['status'];
          switch (errorStatusCode) {
            case 404:
              this.saveObject(`${this.repoImagesStorageKey}${repoName}`, new ObjectWrapper());
              break;
          }
          return of(null);
        }),
        map(res => {
          const objectWrapper = new ObjectWrapper();
          objectWrapper.object = res;
          this.saveObject(`${this.repoImagesStorageKey}${repoName}`, objectWrapper)

          return res;
        })
      );
  }

  getRepoBrandImage(repoName: string, callback: (url: string) => void): void {
    const IMAGE_LOAD_TIMEOUT = 2000
    testImage(`${environment.githubRawContentUrl}/${environment.githubUserName}/${repoName}/master/resources/logo.svg`, IMAGE_LOAD_TIMEOUT, (url, status) => {
      if (status == 'success') {
        callback(url);
        return;
      }
      callback(`${environment.githubRawContentUrl}/${environment.githubUserName}/${repoName}/master/resources/logo.png`)
    })
  }

  getObjectSaved(id: string): ObjectWrapper {
    return ObjectWrapper.fromJSON(JSON.parse(localStorage.getItem(id) as string));
  }

  saveObject(id: string, object: ObjectWrapper) {
    object.dateSaved = new Date();
    localStorage.setItem(id, JSON.stringify(object));
  }

}

function testImage(url: string, timeout: number, callback: (url: string, status: string) => void) {
  timeout = timeout || 5000;
  var timedOut = false, timer: any;
  var img = new Image();
  img.onerror = img.onabort = function () {
    if (!timedOut) {
      clearTimeout(timer);
      callback(url, "error");
    }
  };
  img.onload = function () {
    if (!timedOut) {
      clearTimeout(timer);
      callback(url, "success");
    }
  };
  img.src = url;
  timer = setTimeout(function () {
    timedOut = true;
    // reset .src to invalid URL so it stops previous
    // loading, but doesn't trigger new load
    img.src = "//!!!!/test.jpg";
    callback(url, "timeout");
  }, timeout);
}

export class ObjectWrapper {
  object: any;
  dateSaved?: Date;

  static fromJSON(wrapperJson: any): ObjectWrapper {
    if (!wrapperJson) { return new ObjectWrapper(); }

    const objectWrapper: ObjectWrapper = new ObjectWrapper();
    objectWrapper.dateSaved = new Date(wrapperJson.dateSaved);
    objectWrapper.object = wrapperJson.object;

    return objectWrapper;
  }
}
