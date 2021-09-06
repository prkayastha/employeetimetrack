import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './modules/authentication/pages/login/login.component';
import { RegisterComponent } from './modules/authentication/pages/register/register.component';
import { VerifyEmailComponent } from './modules/authentication/pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './modules/authentication/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/authentication/pages/reset-password/reset-password.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { EmployeeListComponent } from './modules/employee-list/employee-list.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { UpdateUserComponent } from './modules/update-user/update-user.component';
import { AuthGuard } from './_helpers';
import { ProjectListComponent } from './modules/project/project-list/project-list.component';


const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/authentication/auth.module').then(m => m.AuthModule)},
  {
    path: 'home',
    component: DefaultComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'employee-list',
        component: EmployeeListComponent
      },
      {
        path: 'update/:userId', component: UpdateUserComponent
      },
      {
        path: 'workdiary', component: WorkdiaryComponent
      },
      { 
        path: 'projects', component: ProjectListComponent 
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
