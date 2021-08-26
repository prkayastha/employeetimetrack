import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { VerifyEmailComponent } from './modules/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { LayoutComponent } from './modules/layout/layout.component';
import { EmployeeListComponent } from './modules/employee-list/employee-list.component';




const routes: Routes = [
 { path: '',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'forget-password',component:ForgotPasswordComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'verify-email',component:VerifyEmailComponent},
  
  {
    path: 'home',
    component: DefaultComponent,
    children: [{
      path: 'dashboard',
      component: DashboardComponent
    }, {
      path: 'posts',
      component: PostsComponent
    },{
      path:'employee-list',
      component:EmployeeListComponent
    }]
  } 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
