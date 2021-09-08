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

}
