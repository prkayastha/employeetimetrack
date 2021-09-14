import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectListComponent } from "./pages/project-list/project-list.component";
import { TaskListComponent } from "./pages/task-list/task-list.component";

const route: Routes = [
    {path: 'list', component: ProjectListComponent},
    {path: 'task/:projectid', component: TaskListComponent},
    {path: '', redirectTo: '/project/list'}
];

@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})

export class ProjectRoutingModule{
}