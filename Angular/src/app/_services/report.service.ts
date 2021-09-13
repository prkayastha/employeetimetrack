import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import * as moment from "moment-timezone";

import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable()
export class ReportService {

    constructor(private http: HttpClient) { }

    getWorkDiary(date: string, offset: string, userId: number): Observable<any> {
        return this.http.post(
            `${baseUrl}/workdiary`,
            {
                date,
                offset,
                userId
            }
        ).pipe(
            map((result: any[]) => {
                const mapped = result.map(eachTime => {
                    let tasks = [];
                    eachTime.taskInfo.forEach(taskInfo => {
                        tasks = [...tasks, ...taskInfo.log]
                    });
                    eachTime['flatterned'] = tasks;
                    return eachTime;
                });
                console.log(mapped);
                return mapped;
            })
        )
    }
}