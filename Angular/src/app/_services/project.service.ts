import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  createProject(value: any): Observable<any> {
    return this.http.post<any>(
      `${baseUrl}/project/upsert`,
      value
    );
  }

}
