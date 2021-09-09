import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LocalStorageService } from "ngx-localstorage";
import { SharedModule } from "../shared/shared.module";
import { ErrorInterceptor, JwtInterceptor } from "../../_helpers";
import { AccountService } from "../../_services";
import { EmployeeListComponent } from "./pages/employee-list/employee-list.component";
import { UpdateUserComponent } from "./pages/update-user/update-user.component";
import { UserRoutingModule } from "./user-routing.module";
import { UserService } from "./user.service";

@NgModule({
    declarations: [
        EmployeeListComponent,
        UpdateUserComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        LocalStorageService,
        AccountService,
        UserService
    ]
})

export class UserModule {
}