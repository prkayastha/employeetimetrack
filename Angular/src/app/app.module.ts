import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule } from './layouts/default/default.module';
import { LoginComponent } from './modules/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './modules/register/register.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { AlertComponent } from './_components';
import { VerifyEmailComponent } from './modules/verify-email/verify-email.component';
import { EmployeeListComponent } from './modules/employee-list/employee-list.component';
import { UpdateUserComponent } from './modules/update-user/update-user.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { ProjectListComponent } from './modules/project/project-list/project-list.component';
import { CreateProjectComponent } from './modules/project/create-project/create-project.component';
import { UpdateProjectComponent } from './modules/project/update-project/update-project.component';
import { TaskListComponent } from './modules/task/task-list/task-list.component';
import { UpdateTaskComponent } from './modules/task/update-task/update-task.component';
import { CreateTaskComponent } from './modules/task/create-task/create-task.component';
import { NgxLocalStorageModule, LocalStorageService } from 'ngx-localstorage';
import { LayoutComponent } from './modules/layout/layout.component';
import { PostsComponent } from './modules/posts/posts.component';
import { ProjectsComponent } from './modules/projects/projects.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    EmployeeListComponent,
    UpdateUserComponent,
    WorkdiaryComponent,
    ProjectListComponent,
    CreateProjectComponent,
    UpdateProjectComponent,
    TaskListComponent,
    UpdateTaskComponent,
    CreateTaskComponent,
    LayoutComponent, //TODO: refactor
    PostsComponent, //TODO: refactor
    ProjectsComponent  //TODO: refactor
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
    LocalStorageService

  ],
  bootstrap: [AppComponent],
  

})
export class AppModule { }
