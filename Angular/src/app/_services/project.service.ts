import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  createProject(value: any): Observable<any> {
      throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient
  ) { }

  //Projct List
  getAllProject() {
    const option = {
      offset: 0,
      limit: 100,
      orderBy: "id",
      order: "Desc",
      search: null,
    }
    return this.http.post<any[]>(`${baseUrl}/project/list`, option);
  }

}
