import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AccountService } from '../_services';
import { UserDetails } from '../_models/userDetails';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,
        private userDetails: UserDetails) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let isLoggedIn = !!this.userDetails.token;
        
            if ([401, 403].includes(err.status) && isLoggedIn) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err);
            return throwError(error);
        }))
    }
}