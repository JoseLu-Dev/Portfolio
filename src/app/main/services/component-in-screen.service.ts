import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentInScreenService {

  private elementInScreen = new BehaviorSubject<string>('');

  constructor() { }

  getElementInScreen(){
    return this.elementInScreen.asObservable();
  }

  setElementInScreen(element: string){
    this.elementInScreen.next(element);
  }
}
