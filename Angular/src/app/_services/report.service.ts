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
                    eachTime.taskInfo = eachTime.taskInfo.map(taskInfo => {
                        tasks = [...tasks, ...taskInfo.log];
                        return {
                            taskId: taskInfo.taskId,
                            taskDescription: taskInfo.taskDescription,
                            timeSlot: taskInfo.log.map(each => each.timeMinutes / 10),
                            log: taskInfo.log
                        };
                    });
                    eachTime['flatterned'] = tasks;

                    const descriptionList = [];
                    for (let i = 0; i < 6; i++) {
                        const lastObj = descriptionList.slice(-1).pop();

                        const descp = eachTime.taskInfo.find(description => description.timeSlot.includes(i));

                        if (!descp && !lastObj) {
                            descriptionList.push({
                                taskId: 0,
                                taskDescription: null,
                                timeSlot: [i]
                            })
                        } else if (!descp && !!lastObj) {
                            if (lastObj.taskId == 0) {
                                lastObj.timeSlot.push(i)
                            } else {
                                descriptionList.push({
                                    taskId: 0,
                                    taskDescription: null,
                                    timeSlot: [i]
                                })
                            }
                        } else if (!!descp && !!lastObj) {
                            if (lastObj.taskId == descp.taskId) {
                                lastObj.timeSlot.push(i)
                            } else {
                                descriptionList.push({
                                    taskId: descp.taskId,
                                    taskDescription: descp.taskDescription,
                                    timeSlot: [i]
                                })
                            }
                        } else if (!!descp && !lastObj) {
                            descriptionList.push({
                                taskId: descp.taskId,
                                taskDescription: descp.taskDescription,
                                timeSlot: [i]
                            })
                        }
                    }
                    eachTime['descriptionList'] = descriptionList;

                    delete eachTime['taskInfo']
                    return eachTime;
                });
                return mapped;
            })
        )
    }

    markScreen(screenInfo: { id: number; markUnproductive: boolean; }): Observable<any> {
        return this.http.post(
            `${baseUrl}/workdiary/segregate`,
            screenInfo
        )
    }


    getEmployeeReport(): Observable<any> {
        return this.http.get(
            `${baseUrl}/dashboard/report?userId=32`,
        )
    }

    getPDFReport(): Observable<any> {
        return this.http.get(
            `${baseUrl}/dashboard/report/list?userId=32`,
        )
    }

        dashboard(id:number): Observable<any> {
        return this.http.get(
            `${baseUrl}/dashboard?userId=${id}`,
        )
    }
    
}