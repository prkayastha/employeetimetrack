import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LocalStorageService } from "ngx-localstorage";
import { ErrorInterceptor, JwtInterceptor } from "../../_helpers";
import { ProjectService } from "../../_services/project.service";
import { ProjectRoutingModule } from "./project-rounting.module";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ProjectRoutingModule
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