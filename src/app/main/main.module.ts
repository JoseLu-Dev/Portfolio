import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroductionComponent } from './introduction/introduction.component';


@NgModule({
  declarations: [MainComponent, NavbarComponent, IntroductionComponent],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
