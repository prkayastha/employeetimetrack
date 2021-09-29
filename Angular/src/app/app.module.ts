import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerConfig, BsDatepickerModule, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { LocalStorageService, NgxLocalStorageModule } from 'ngx-localstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { PostsComponent } from './modules/posts/posts.component';
import { TaskTimerComponent } from './modules/project/pages/project-list/task-timer/task-timer.component';
import { SharedModule } from './modules/shared/shared.module';
import { PdfreportComponent } from './modules/user/pages/view-user/report/pdfreport/pdfreport.component';
import { ReportComponent } from './modules/user/pages/view-user/report/report.component';
import { ArchiveListComponent } from './modules/workdiary/archive-list/archive-list.component';
import { ArchiveTaskComponent } from './modules/workdiary/archive-task/archive-task.component';
import { ViewCaptureComponent } from './modules/workdiary/component/view-capture.component';
import { CreateTaskComponent } from './modules/workdiary/create-task/create-task.component';
import { TaskListComponent } from './modules/workdiary/task-list/task-list.component';
import { TaskComponent } from './modules/workdiary/task/task.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { AlertComponent } from './_components';
import { DefaultModule } from './_components/default/default.module';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { ProjectService } from './_services/project.service';
import { ReportService } from './_services/report.service';
import { SharedDataService } from './_services/shared-data.service';
import { SpinnerService } from './_services/spinner.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    WorkdiaryComponent,
    CreateTaskComponent,
    TaskListComponent,
    TaskComponent,
    LayoutComponent,
    ArchiveListComponent,
    ArchiveTaskComponent,
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
    BsDaterangepickerConfig,
    SharedDataService,
    SpinnerService
  ],
  entryComponents: [
    TaskTimerComponent,
    ViewCaptureComponent,
    PdfreportComponent
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
