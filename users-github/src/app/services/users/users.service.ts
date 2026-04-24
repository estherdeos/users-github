import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISearchUsers } from 'src/app/interfaces/search-users.model';
import { IRepository } from 'src/app/interfaces/repository.model';

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
  ): Observable<ISearchUsers> {
    const url = `${this.baseUrl}/search/users?q=${searchText}&per_page=${perPage}&page=${page}`;
    return this.http.get<ISearchUsers>(url, {});
  }

  getReposByUsername(username: string): Observable<IRepository[]> {
    const url = `${this.baseUrl}/users/${username}/repos`;
    return this.http.get<IRepository[]>(url, {});
  }
}
