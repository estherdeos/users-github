import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DetailsComponent } from './details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { IRepository } from '../interfaces/repository.model';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconsModule } from '@ng-icons/core';
import { octMarkGithub, octRepoForked, octStar } from '@ng-icons/octicons';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let router: Router;

  const mockedUsersService = jasmine.createSpyObj('UsersService', [
    'getReposByUsername',
  ]);

  const reposRes: IRepository[] = [
    {
      name: 'users-github',
      html_url: 'https://github.com/estherdeos/users-github',
      stargazers_count: 0,
      forks_count: 0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgbAlertModule,
        NgIconsModule.withIcons({ octMarkGithub, octRepoForked, octStar }),
      ],
      declarations: [DetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { username: 'estherdeos' },
            },
          },
        },
        {
          provide: UsersService,
          useValue: mockedUsersService,
        },
      ],
    }).compileComponents();

    mockedUsersService.getReposByUsername.and.returnValue(of(reposRes));

    fixture = TestBed.createComponent(DetailsComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get repos from username', fakeAsync(() => {
    tick(300);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(mockedUsersService.getReposByUsername).toHaveBeenCalled();
      expect(component.repos.length).toBe(1);
    });
  }));

  it('should handle error on getting repos', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    mockedUsersService.getReposByUsername.and.returnValue(
      throwError(() => error),
    );

    component.getRepos();

    expect(mockedUsersService.getReposByUsername).toHaveBeenCalled();
    expect(component.showErrorMessage).toBe(true);
  });

  it('should close error message', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    mockedUsersService.getReposByUsername.and.returnValue(
      throwError(() => error),
    );

    component.getRepos();
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('ngb-alert'));

    errorMessage.triggerEventHandler('closed', null);
    fixture.detectChanges();

    expect(component.showErrorMessage).toBe(false);
  });

  it('should go back to homepage', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');

    const btnGoBack = fixture.debugElement.query(
      By.css('#btn-go-back'),
    ).nativeElement;
    btnGoBack.click();

    tick();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  }));
});
