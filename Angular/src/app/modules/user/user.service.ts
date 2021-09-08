import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable()
export class UserService {
    constructor( private http: HttpClient){
    }

    getAllManager(): Observable<any> {
        return this.http.get(
            `${baseUrl}/user/getAllManager`
        );
    }

    getAllEmployee(): Observable<any> {
        return this.http.get(
            `${baseUrl}/user/getAllEmployee`
        );
    }
}