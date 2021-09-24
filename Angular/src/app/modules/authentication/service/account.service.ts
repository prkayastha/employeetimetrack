import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Account } from '../../../_models';
import { offset } from 'highcharts';
import { UserDetails } from '../../../_models/userDetails';

const baseUrl = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AccountService {

    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private http: HttpClient,
        private user: UserDetails
    ) {
        this.accountSubject = new BehaviorSubject<Account>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account {
        return this.accountSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/auth/check`, { username: email, password })
            .pipe(map(account => {
                this.accountSubject.next(account);
                this.user.setDetails(account);
                // this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        // this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        this.user.clearDetails();
        this.router.navigate(['/auth/login']);
    }

    refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    register(account: Account) {
        return this.http.post(`${baseUrl}/user/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/password/reset`, { username: email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/password/check/token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/password/change`, { reset: token, password, confirmPassword });
    }

    getAll(): Observable<any> {
        const option = {
            offset: 0,
            limit: 100,
            orderBy: "id",
            order: "Desc",
            search: null,
        }
        return this.http.post<Account[]>(`${baseUrl}/user/list`, option);
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    create(params) {
        return this.http.put('${baseUrl}', params);
    }

    update(id, params) {
        return this.http.put(`${baseUrl}/user/update/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/user/delete/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }



    // Create Project
    createProject(params) {
        return this.http.put('${baseUrl}/Project/upsert ', params);
    }

    //delete Project
    deleteProject(id: string) {
        return this.http.delete(`${baseUrl}/user/delete/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    //update Project
    updateProject(id, params) {
        return this.http.put(`${baseUrl}/user/update/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    // Create Task
    createTask(params) {
        return this.http.put('${baseUrl}', params);
    }

    //delete Task
    deleteTask(id: string) {
        return this.http.delete(`${baseUrl}/user/delete/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    //update Task
    updateTask(id, params) {
        return this.http.put(`${baseUrl}/user/update/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    getUser(userId: number): Observable<any> {
        return this.http.get(
            `${baseUrl}/user/${userId}`
        )
    }


    // helper methods

    private refreshTokenTimeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtToken = JSON.parse(atob(this.accountValue.token.split('.')[1]));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}