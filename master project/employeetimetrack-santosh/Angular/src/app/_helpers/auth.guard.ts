﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserDetails } from '../_models/userDetails';

import { AccountService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private user: UserDetails
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;

        const isLoggedIn = !!this.user.token;

        if (!isLoggedIn) {
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        return true;

        /* if (account) {
            // check if route is restricted by role
            if (route.data.roles && !route.data.roles.includes(account.role)) {
                // role not authorized so redirect to home page
                this.router.navigate(['/']);
                return false;
            }

            // authorized so return true
            return true;
        }

        // not logged in so redirect to login page with the return url 
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
        return false; */
    }
}