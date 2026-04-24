import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../services/users/users.service';
import { debounceTime, fromEvent, map, take } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../interfaces/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
  });

  @ViewChild('usernameField') usernameField!: ElementRef<HTMLInputElement>;

  loading: boolean = false;
  users: IUser[] = [];

  page: number = 1;
  pageSize: number = 12;
  collectionSize: number = 0;

  showErrorMessage: boolean = false;

  ngAfterViewInit(): void {
    fromEvent(this.usernameField.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(() => {
        if (this.form.get('username')?.value) {
          this.page = 1;
          this.getUsers();
        }
      });
  }

  getUsers(): void {
    this.loading = true;

    this.usersService
      .getUsersByUsername(
        this.form.get('username')?.value,
        this.pageSize,
        this.page,
      )
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.users = res.items;
          this.collectionSize = res.total_count;
          this.loading = false;
        },
        error: () => {
          this.showErrorMessage = true;
        },
      });
  }

  openDetails(username: string): void {
    this.router.navigate([`detalhes/${username}`], {
      relativeTo: this.activatedRoute,
    });
  }

  closeErrorMessage(): void {
    this.showErrorMessage = false;
  }
}
