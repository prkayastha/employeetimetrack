import { HttpClient } from '@angular/common/http';
import { Injectable, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {




  constructor(
    private http: HttpClient
  ) { }

  getAllProject(option: any) {
    return this.http.post<any[]>(`${baseUrl}/project/list`, option);
  }

  getProjectDetail(id: number) {
    return this.http.get(
      `${baseUrl}/project/${id}`
    )
  }

  createProject(value: any): Observable<any> {
    return this.http.post<any>(
      `${baseUrl}/project/upsert`,
      value
    );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete<any>(
      `${baseUrl}/project/delete/${id}`,
    );
  }
  addTask(taskname: string, id: any, userid: number): Observable<any> {
    const obj = {
      id: 0,
      taskDescription: taskname,
      projectId: id,
      assigneedUserId: userid,
      version: 0
    }

    return this.http.post<any>(
      `${baseUrl}/task/upsert`, obj)
  }
  getAllTask(tasklist: any) {
    return this.http.post<any>(
      `${baseUrl}/task/1`, tasklist)
  }
  deleteTask(id: number) {
    return this.http.delete<any>(
      `${baseUrl}/task/delete/${id}`)
  }

}
