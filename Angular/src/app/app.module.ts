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
import { ProjectsComponent } from './modules/projects/projects.component';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';

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
    ProjectsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent],
  

})
export class AppModule { }
