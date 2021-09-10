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
import { CreateTaskComponent } from './modules/workdiary/create-task/create-task.component';
import { TaskListComponent } from './modules/workdiary/task-list/task-list.component';
import { TaskComponent } from './modules/workdiary/task/task.component';
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
    CreateTaskComponent,
    TaskListComponent,
    TaskComponent,
    LayoutComponent,
    PostsComponent, //TODO: refactor
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
    NgxLocalStorageModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    LocalStorageService,
    ProjectService
  ],
  entryComponents: [
    CreateTaskComponent
  ],
  bootstrap: [AppComponent],


})
export class AppModule { }
