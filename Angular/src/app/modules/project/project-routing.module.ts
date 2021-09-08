import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectListComponent } from "./pages/project-list/project-list.component";

const route: Routes = [
    {path: 'list', component: ProjectListComponent}
];

@NgModule({
    imports: [RouterModule.forChild(route)],
    exports: [RouterModule]
})

export class ProjectRoutingModule{
}