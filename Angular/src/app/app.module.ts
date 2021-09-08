import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService, NgxLocalStorageModule } from 'ngx-localstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { PostsComponent } from './modules/posts/posts.component';
import { SharedModule } from './modules/shared/shared.module';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { AlertComponent } from './_components';
import { DefaultModule } from './_components/default/default.module';
import { TableComponent } from './_components/table/table.component';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { ProjectService } from './_services/project.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    WorkdiaryComponent,
    LayoutComponent,
    PostsComponent, //TODO: refactor
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    ReactiveFormsModule,
    SharedModule,
    NgxLocalStorageModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LocalStorageService,
    ProjectService
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
