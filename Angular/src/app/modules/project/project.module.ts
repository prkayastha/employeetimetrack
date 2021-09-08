import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LocalStorageService } from "ngx-localstorage";
import { ErrorInterceptor, JwtInterceptor } from "../../_helpers";
import { ProjectService } from "../../_services/project.service";
import { SharedModule } from "../shared/shared.module";
import { CreateProjectComponent } from "./pages/create-project/create-project.component";
import { CreateTaskComponent } from "./pages/create-task/create-task.component";
import { ProjectListComponent } from "./pages/project-list/project-list.component";
import { TaskListComponent } from "./pages/task-list/task-list.component";
import { UpdateProjectComponent } from "./pages/update-project/update-project.component";
import { UpdateTaskComponent } from "./pages/update-task/update-task.component";
import { ProjectRoutingModule } from "./project-routing.module";

@NgModule({
    declarations: [
        ProjectListComponent,
        CreateProjectComponent,
        UpdateProjectComponent,
        TaskListComponent,
        UpdateTaskComponent,
        CreateTaskComponent,
    ],
    imports: [
        CommonModule,
        ProjectRoutingModule,
        SharedModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        LocalStorageService,
        ProjectService
    ]
})

export class ProjectModule {

}