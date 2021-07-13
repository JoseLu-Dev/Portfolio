import { KeysPipe } from './pipes/keys.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SkillsComponent } from './skills/skills.component';
import { ValuePipe } from './pipes/value.pipe';
import { ProjectsComponent } from './projects/projects.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { SwiperModule } from 'swiper/angular';
import { ContactComponent } from './contact/contact.component';


@NgModule({
  declarations:
    [
      MainComponent,
      NavbarComponent,
      IntroductionComponent,
      SkillsComponent,
      KeysPipe,
      ValuePipe,
      ProjectsComponent,
      AboutMeComponent,
      ContactComponent
    ],
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    SwiperModule,
  ]
})
export class MainModule { }
