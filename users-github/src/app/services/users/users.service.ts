import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  private baseUrl = `${environment.apiUrl}`;

  getUsersByUsername(
    searchText: string,
    perPage: number,
    page: number,
  ): Observable<any> {
    const url = `${this.baseUrl}/search/users?q=${searchText}&per_page=${perPage}&page=${page}`;
    return this.http.get<any>(url, {});
  }

  getReposByUsername(username: string): Observable<any> {
    const url = `${this.baseUrl}/users/${username}/repos`;
    return this.http.get<any>(url, {});
  }
}
