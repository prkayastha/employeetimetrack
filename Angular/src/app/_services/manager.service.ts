import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }

  getAll() {
    const option = {
      offset: 0,
      limit: 100,
      orderBy: "id",
      order: "Desc",
      search: null,
    }
    return this.http.post<any[]>(`${baseUrl}/user/list`, option);
  }
}
