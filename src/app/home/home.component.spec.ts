import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../services/users/users.service';
import { of, throwError } from 'rxjs';
import {
  NgbAlertModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ISearchUsers } from '../interfaces/search-users.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIconsModule } from '@ng-icons/core';
import { octMarkGithub, octRepoForked, octStar } from '@ng-icons/octicons';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  const mockedUsersService = jasmine.createSpyObj('UsersService', [
    'getUsersByUsername',
  ]);

  const usersRes: ISearchUsers = {
    items: [
      {
        login: 'estherdeos',
        avatar_url: 'https://avatars.githubusercontent.com/u/26550416?v=4',
      },
    ],
    total_count: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbAlertModule,
        NgIconsModule.withIcons({ octMarkGithub, octRepoForked, octStar }),
      ],
      declarations: [HomeComponent],
      providers: [
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    router = TestBed.inject(Router);
    mockedUsersService.getUsersByUsername.and.returnValue(of(usersRes));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for username on input event', fakeAsync(() => {
    const inputEl = fixture.componentInstance.usernameField.nativeElement;

    inputEl.value = 'estherdeos';
    inputEl.dispatchEvent(new Event('input'));

    tick(300);
    fixture.detectChanges();

    expect(component.form.get('username')?.value).toBe('estherdeos');
    fixture.whenStable().then(() => {
      expect(mockedUsersService.getUsersByUsername).toHaveBeenCalled();
      expect(component.users.length).toBe(1);
    });
  }));

  it('should open details', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');

    component.users = usersRes.items;
    fixture.detectChanges();

    const btnDetails = fixture.debugElement.query(
      By.css('#btn-details'),
    ).nativeElement;
    btnDetails.click();

    tick();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith([`detalhes/estherdeos`]);
  }));

  it('should handle error on getting users', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    mockedUsersService.getUsersByUsername.and.returnValue(
      throwError(() => error),
    );

    component.getUsers();

    expect(mockedUsersService.getUsersByUsername).toHaveBeenCalled();
    expect(component.showErrorMessage).toBe(true);
  });

  it('should close error message', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    mockedUsersService.getUsersByUsername.and.returnValue(
      throwError(() => error),
    );

    component.getUsers();
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('ngb-alert'));

    errorMessage.triggerEventHandler('closed', null);
    fixture.detectChanges();

    expect(component.showErrorMessage).toBe(false);
  });
});
