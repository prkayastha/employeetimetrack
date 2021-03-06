import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {
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

    getAllUsers(option: any): Observable<any> {
        return this.http.post<any>(`${baseUrl}/user/list`, option).pipe(
            map((response) => {
                response.collection = response.collection.map(user => {
                    const mapping = {};
                    mapping['id'] = user.id;
                    mapping['name'] = `${user.firstname} ${user.lastname}`;
                    mapping['designation'] = !!user.UserDetail ? user.UserDetail.designation : 'N/A';
                    mapping['noOfProject'] = user.noOfProjects;
                    mapping['timeSpent'] = user.timeSpent;
                    mapping['role'] = user.roles[0].role
                    return mapping;
                });
                return response;
            })
        );
    }

    getUserById(userId: number): Observable<any> {
        return this.http.get(
            `${baseUrl}/user/${userId}`
        ).pipe(
            map((user: any) => {
                user['fullname'] = `${user.firstname} ${user.lastname}`;
                user['skills'] = !!user['skills'] ? user['skills'].split(',') : null;
                return user;
            })
        );
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete<any>(
            `${baseUrl}/user/delete/${userId}`
        );
    }
}