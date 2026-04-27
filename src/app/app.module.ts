import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { DetailsComponent } from './details/details.component';
import { NgIconsModule } from '@ng-icons/core';
import { octMarkGithub, octRepoForked, octStar } from '@ng-icons/octicons';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlert,
    NgIconsModule.withIcons({ octMarkGithub, octRepoForked, octStar }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
