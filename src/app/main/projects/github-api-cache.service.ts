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
    if (userRepos.etag) { headers.append('If-None-Match', userRepos.etag); }

    return this.http.get<Repo[]>(this.userReposUrl, { observe: 'response' as 'body', headers: headers })
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

          if (!modifiedSince) { res = userRepos.object }
          else {
            const etag = res.headers.get('etag');
            res = res['body'];
            const objectWrapper = new ObjectWrapper();
            objectWrapper.object = res;
            objectWrapper.etag = etag;
            this.saveObject(this.userReposStorageKey, objectWrapper)
          }
          return res;
        })
      );
  }

  getRepoTopics(repoName: string) {

    let modifiedSince = true;
    const repoTopics: ObjectWrapper = this.getObjectSaved(`${this.repoTopicsStorageKey}${repoName}`);

    let headers: HttpHeaders = new HttpHeaders()
      .set('Accept', 'application/vnd.github.mercy-preview+json')

    if (repoTopics?.etag) { headers = headers.set('If-None-Match', repoTopics.etag); }

    return this.http.get(
      `${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/topics`,
      { observe: 'response' as 'body', headers: headers }
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
        if (!modifiedSince) { res = repoTopics.object }
        else {
          const etag = res.headers.get('etag');
          res = res['body'];
          const objectWrapper = new ObjectWrapper();
          objectWrapper.object = res;
          objectWrapper.etag = etag;
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
    if (repoImages?.object && repoImages.dateSaved.getMilliseconds() > new Date().setHours(new Date().getHours()+1)) { 
      return of(repoImages.object); 
    }

    return this.http.get(
      `${environment.githubAPIUrl}/repos/${environment.githubUserName}/${repoName}/contents/resources/images`,
      { observe: 'response' as 'body', headers: headers }
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
          if (!modifiedSince) { res = repoImages.object }
          else {
            const etag = res.headers.get('etag');
            res = res['body'];
            const objectWrapper = new ObjectWrapper();
            objectWrapper.object = res;
            objectWrapper.etag = etag;
            this.saveObject(`${this.repoImagesStorageKey}${repoName}`, objectWrapper)
          }
          return res;
        })
      );
  }

  getRepoBrandImage(repoName: string, callback: (url: string) => void): void {
    testImage(`${environment.githubRawContentUrl}/${environment.githubUserName}/${repoName}/master/resources/logo.svg`, 700, (url, status) => {
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
  etag: string = '';
  object: any;
  dateSaved: Date = new Date();

  static fromJSON(wrapperJson: any): ObjectWrapper {
    if (!wrapperJson) { return new ObjectWrapper(); }

    const objectWrapper: ObjectWrapper = new ObjectWrapper();
    objectWrapper.etag = wrapperJson.etag;
    objectWrapper.object = wrapperJson.object;

    return objectWrapper;
  }
}
