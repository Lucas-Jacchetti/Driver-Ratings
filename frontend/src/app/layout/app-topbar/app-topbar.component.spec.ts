import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppTopbarComponent } from './app-topbar.component';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserResponseDTO } from '../../shared/models/user.model';

describe('AppTopbarComponent', () => {
  let fixture: ComponentFixture<AppTopbarComponent>;
  let component: AppTopbarComponent;
  let isAuthenticated: ReturnType<typeof signal<boolean>>;
  let currentUser: ReturnType<typeof signal<UserResponseDTO | null>>;
  let authServiceMock: {
    isAuthenticated: ReturnType<typeof signal<boolean>>;
    currentUser: ReturnType<typeof signal<UserResponseDTO | null>>;
    logout: jest.Mock;
  };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    isAuthenticated = signal(false);
    currentUser = signal<UserResponseDTO | null>(null);
    authServiceMock = { isAuthenticated, currentUser, logout: jest.fn() };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AppTopbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows a generic greeting and sign-in prompt when logged out', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Hello!');
    expect(text).toContain('Sign in and rate the drivers for the current race.');
  });

  it('does not show the logout button when logged out', () => {
    expect(fixture.nativeElement.textContent).not.toContain('Log out');
  });

  it('greets the user by first name when logged in', () => {
    currentUser.set({
      id: 'u1',
      name: 'Lucas Jacchetti',
      email: 'lucas@example.com',
      createdAt: '2026-01-01T00:00:00Z',
    });
    isAuthenticated.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Hello, Lucas!');
  });

  it('shows the logout button when logged in, and logs out on click', () => {
    currentUser.set({
      id: 'u1',
      name: 'Lucas Jacchetti',
      email: 'lucas@example.com',
      createdAt: '2026-01-01T00:00:00Z',
    });
    isAuthenticated.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Log out');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const logoutButton = buttons.find((b) => b.nativeElement.textContent.includes('Log out'));
    logoutButton!.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('emits menuClick when the menu button is clicked', () => {
    const emitSpy = jest.spyOn(component.menuClick, 'emit');

    const menuButton = fixture.debugElement.query(By.css('button'));
    menuButton.triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalled();
  });
});