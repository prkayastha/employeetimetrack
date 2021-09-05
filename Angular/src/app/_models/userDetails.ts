import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-localstorage";

export interface LoginResponse {
    id: number;
    fullName: string;
    username: string;
    email: string;
    roleId: number;
    role: string;
    createdAt: Date;
    token: string;
}

const USERID: string = 'USERID';
const FULLNAME: string = 'FULLNAME';
const USERNAME: string = 'USERNAME';
const EMAIL: string = 'EMAIL';
const ROLEID: string = 'ROLEID';
const ROLE: string = 'ROLE';
const TOKEN: string = 'TOKEN';

@Injectable({providedIn: 'root'})
export class UserDetails {

    constructor(
        private _localStorage: LocalStorageService
    ) {}

    setDetails(details: LoginResponse) {
        this.id = details.id;
        this.username = details.username;
        this.email = details.email;
        this.roleId = details.roleId;
        this.role = details.role;
        this.token = details.token;
    }

    clearDetails() {
        this._localStorage.remove(USERID);
        this._localStorage.remove(USERNAME);
        this._localStorage.remove(EMAIL);
        this._localStorage.remove(ROLEID);
        this._localStorage.remove(ROLE);
        this._localStorage.remove(TOKEN);  
    }

    isLoggedIn(): boolean {
        return !!this.token;
    }

    set id(id: number) {
        this._localStorage.set(USERID, id);
    }

    get id() {
        return this._localStorage.get(USERID);
    }

    set username(username: string) {
        this._localStorage.set(USERNAME, username);
    }

    get username() {
        return this._localStorage.get(USERNAME);
    }

    set email(email: string) {
        this._localStorage.set(EMAIL, email);
    }

    get email() {
        return this._localStorage.get(EMAIL);
    }

    set roleId(roleId: number) {
        this._localStorage.set(ROLEID, roleId);
    }

    get roleId() {
        return this._localStorage.get(ROLEID);
    }

    set role (role: string) {
        this._localStorage.set(ROLE, role);
    }

    get role() {
        return this._localStorage.get(ROLE);
    }

    set token(token: string) {
        this._localStorage.set(TOKEN, token);
    }

    get token() {
        return this._localStorage.get(TOKEN);
    }

    set fullName(fullName: string) {
        this._localStorage.set(FULLNAME, fullName)
    }

    get fullName() {
        return this._localStorage.get(FULLNAME);
    }
}