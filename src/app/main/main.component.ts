import { Component, OnInit, HostListener, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ComponentInScreenService } from './services/component-in-screen.service';

const areas = 'introduction, projects, skills, aboutMe, contact'
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {

  @ViewChildren(areas, { read: ElementRef })
  sections!: QueryList<any>;

  constructor(private componentInScreenService: ComponentInScreenService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    setTimeout(() => this.onScroll(undefined), 0);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const activeSection = this.sections.toArray()
      .findIndex(section => {
        return isElementInViewport(section.nativeElement)
      });

    this.componentInScreenService.setElementInScreen(areas.split(',')[activeSection].trim());
  }
}

const NAVBAR_HEIGHT = 64;

function isElementInViewport(el: any) {
  var rect = el.getBoundingClientRect();

  return (
    rect.bottom >= 0 + NAVBAR_HEIGHT &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
