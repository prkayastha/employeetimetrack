import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { ProjectService } from './_services/project.service';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ReportService } from './_services/report.service';
import { ViewCaptureComponent } from './modules/workdiary/component/view-capture.component';
import { TaskTimerComponent } from './modules/project/pages/project-list/task-timer/task-timer.component';
import { ReportComponent } from './modules/user/pages/view-user/report/report.component';
import { PdfreportComponent } from './modules/user/pages/view-user/report/pdfreport/pdfreport.component';
import { UserModule } from './modules/user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    WorkdiaryComponent,
    LayoutComponent,
    PostsComponent, //TODO: refactor
    ViewCaptureComponent,
    TaskTimerComponent,
    ReportComponent,
    PdfreportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DefaultModule,
    ReactiveFormsModule,
    SharedModule,
    UserModule,
    NgxLocalStorageModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LocalStorageService,
    ProjectService,
    ReportService,
    BsDatepickerConfig,
    BsDaterangepickerConfig
  ],
  entryComponents: [
    TaskTimerComponent,
    ViewCaptureComponent,
    PdfreportComponent
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
