import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProjectListComponent } from './modules/project/pages/project-list/project-list.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { DefaultComponent } from './_components/default/default.component';
import { AuthGuard } from './_helpers';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/authentication/auth.module').then(m => m.AuthModule)},
  {
    path: '',
    component: DefaultComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)},
      {
        path: 'workdiary', component: WorkdiaryComponent
      },
      { 
        path: 'project', loadChildren: () => import('./modules/project/project.module').then(m => m.ProjectModule)
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
