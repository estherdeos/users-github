import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IRepository } from '../interfaces/repository.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.username = this.activatedRoute.snapshot.params['username'];
  }

  username: string;
  repos: IRepository[] = [];
  loading: boolean = false;

  showErrorMessage: boolean = false;

  ngOnInit(): void {
    this.getRepos();
  }

  getRepos(): void {
    this.loading = true;

    this.usersService
      .getReposByUsername(this.username)
      .pipe(take(1))
      .subscribe({
        next: (res: IRepository[]) => {
          this.repos = res;
          this.loading = false;
        },
        error: () => {
          this.showErrorMessage = true;
        },
      });
  }

  closeErrorMessage(): void {
    this.showErrorMessage = false;
  }
}
