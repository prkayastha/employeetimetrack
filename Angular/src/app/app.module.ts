import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService, NgxLocalStorageModule } from 'ngx-localstorage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultModule } from './layouts/default/default.module';
import { LayoutComponent } from './modules/layout/layout.component';
import { PostsComponent } from './modules/posts/posts.component';
import { CreateProjectComponent } from './modules/project/pages/create-project/create-project.component';
import { ProjectListComponent } from './modules/project/pages/project-list/project-list.component';
import { UpdateProjectComponent } from './modules/project/pages/update-project/update-project.component';
import { CreateTaskComponent } from './modules/project/pages/create-task/create-task.component';
import { TaskListComponent } from './modules/project/pages/task-list/task-list.component';
import { UpdateTaskComponent } from './modules/project/pages/update-task/update-task.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { AlertComponent } from './_components';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { ProjectService } from './_services/project.service';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    WorkdiaryComponent,
    ProjectListComponent, // Project
    CreateProjectComponent, // Project
    UpdateProjectComponent, // Project
    TaskListComponent, // Project
    UpdateTaskComponent, // Project
    CreateTaskComponent, // Project
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
