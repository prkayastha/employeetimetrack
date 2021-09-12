import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import * as moment from "moment-timezone";

import {environment} from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable()
export class ReportService {

    constructor(private http: HttpClient) {}

    getWorkDiary(date: string, offset: string): Observable<any> {
        return this.http.get(
            `${baseUrl}/workdiary?date=${date}&offset=${offset.replace('+', '%2B')}`
        ).pipe(
            map((result) => {
                console.log(result);
                return result;
            })
        )
    }
}