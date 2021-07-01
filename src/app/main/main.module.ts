import { TranslateModule } from '@ngx-translate/core';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [MainComponent, NavbarComponent, IntroductionComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class MainModule { }
