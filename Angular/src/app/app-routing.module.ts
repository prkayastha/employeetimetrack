import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProjectListComponent } from './modules/project/pages/project-list/project-list.component';
import { WorkdiaryComponent } from './modules/workdiary/workdiary.component';
import { DefaultComponent } from './_components/default/default.component';
import { TableComponent } from './_components/table/table.component';
import { AuthGuard } from './_helpers';
import { ReportComponent } from './modules/user/pages/view-user/report/report.component';
import { PdfreportComponent } from './modules/user/pages/view-user/report/pdfreport/pdfreport.component';


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
      },
      {path:'report/:id',component:ReportComponent}
    ]
  },
  { path: 'test', component: TableComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
