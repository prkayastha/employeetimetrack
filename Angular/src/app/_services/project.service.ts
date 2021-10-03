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

  getAllTask(tasklist: any, projectId: number) {
    return this.http.post<any>(
      `${baseUrl}/task/${projectId}`, tasklist)
  }

  deleteTask(id: number) {
    return this.http.delete<any>(
      `${baseUrl}/task/delete/${id}`)
  }

  updateTask(updateTask: { id: any; taskDescription: string; projectId: number; assigneeUserId: number; version: any; }): Observable<any> {
    return this.http.post<any>(
      `${baseUrl}/task/upsert`,
      updateTask
    );
  }

  startTimer(timer: { taskId: number, action: string }) {
    return this.http.post<any>(
      `${baseUrl}/time/update`,
      timer
    );
  }

  uploadScreenshot(id: any, file: File): Observable<any> {
    const form = new FormData();
    form.append("taskId", id);
    form.append("capture", file);
    return this.http.post(
      `${baseUrl}/task/screenshot`,
      form
    );
  }

  importFromTrello(): Observable<any> {
    return this.http.get(
      `${baseUrl}/trello/api/getboards`
    )
  }

  connectTrello(userId: number): Observable<any> {
    return this.http.post(
      `${baseUrl}/trello/api/oauth/requestToken`,
      { userId }
    )
  }

  importProject(id: string): Observable<any> {
    return this.http.post(
      `${baseUrl}/trello/sync`,
      { id }
    )
  }
}
