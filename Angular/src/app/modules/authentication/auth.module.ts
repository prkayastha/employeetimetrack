import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { LocalStorageService } from "ngx-localstorage";
import { SharedModule } from "../shared/shared.module";
import { ErrorInterceptor } from "../../_helpers/error.interceptor";
import { JwtInterceptor } from "../../_helpers/jwt.interceptor";
import { AccountService } from "../../_services";
import { AuthRoutingModule } from "./auth-routing.module";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { VerifyEmailComponent } from "./pages/verify-email/verify-email.component";

@NgModule({
    declarations: [
        LoginComponent, // Auth module
        RegisterComponent, //Auth module
        ResetPasswordComponent, // Auth module
        ForgotPasswordComponent, // Auth module
        VerifyEmailComponent, // Auth module
    ],
    imports: [
        CommonModule,
        SharedModule,
        AuthRoutingModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        LocalStorageService,
        AccountService
    ]
})

export class AuthModule {

}