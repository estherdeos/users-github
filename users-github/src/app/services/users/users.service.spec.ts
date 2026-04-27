import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { IRepository } from 'src/app/interfaces/repository.model';
import { ISearchUsers } from 'src/app/interfaces/search-users.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpController: HttpTestingController;
  const url = environment.apiUrl;

  const usersRes: ISearchUsers = {
    items: [
      {
        login: 'estherdeos',
        avatar_url: 'https://avatars.githubusercontent.com/u/26550416?v=4',
      },
    ],
    total_count: 1,
  };

  const reposRes: IRepository[] = [
    {
      name: 'users-github',
      html_url: 'https://github.com/estherdeos/users-github',
      stargazers_count: 0,
      forks_count: 0,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of users', () => {
    service.getUsersByUsername('estherdeos', 12, 1).subscribe((response) => {
      expect(response.items.length).toBe(1);
      expect(response.items[0].login).toEqual('estherdeos');
      expect(response.items[0].avatar_url).toEqual(
        'https://avatars.githubusercontent.com/u/26550416?v=4',
      );
      expect(response.total_count).toEqual(1);
    });

    const req = httpController.expectOne(
      `${url}/search/users?q=estherdeos&per_page=12&page=1`,
    );
    expect(req.request.method).toBe('GET');

    req.flush(usersRes);
  });

  it('should return a list of repos', () => {
    service.getReposByUsername('estherdeos').subscribe((response) => {
      expect(response.length).toBe(1);
      expect(response[0].name).toEqual('users-github');
      expect(response[0].html_url).toEqual(
        'https://github.com/estherdeos/users-github',
      );
      expect(response[0].stargazers_count).toEqual(0);
      expect(response[0].forks_count).toEqual(0);
    });

    const req = httpController.expectOne(`${url}/users/estherdeos/repos`);
    expect(req.request.method).toBe('GET');

    req.flush(reposRes);
  });
});
