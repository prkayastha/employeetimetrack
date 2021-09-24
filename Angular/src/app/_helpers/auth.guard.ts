import { Injectable } from '@angular/core';
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

        const isLoggedIn = !!this.user.token;

        if (!isLoggedIn) {
            this.accountService.logout();
            this.router.navigate(['/auth', 'login'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        return true;
    }
}