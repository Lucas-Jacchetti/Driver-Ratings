import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProfilePageComponent } from './profile-page.component';
import { AuthService } from '../../../auth/services/auth.service';
import { UserResponseDTO } from '../../../../shared/models/user.model';

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let component: ProfilePageComponent;
  let currentUser: ReturnType<typeof signal<UserResponseDTO | null>>;
  let authServiceMock: { currentUser: ReturnType<typeof signal<UserResponseDTO | null>>; logout: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    currentUser = signal<UserResponseDTO | null>(null);
    authServiceMock = { currentUser, logout: jest.fn() };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
  });

  it('falls back to placeholder values when there is no current user', () => {
    fixture.detectChanges();

    expect(component.user).toEqual({ initial: '?', name: 'User', email: '', memberSince: '' });
    expect(fixture.nativeElement.textContent).toContain('User');
  });

  it('derives initial, name, email and formatted join date from the current user', () => {
    currentUser.set({
      id: 'u1',
      name: 'lucas silva',
      email: 'lucas@example.com',
      createdAt: '2026-03-15T00:00:00Z',
    });
    fixture.detectChanges();

    expect(component.user.initial).toBe('L');
    expect(component.user.name).toBe('lucas silva');
    expect(component.user.email).toBe('lucas@example.com');
    expect(component.user.memberSince).toBe(new Date('2026-03-15T00:00:00Z').toLocaleDateString());
  });

  it('logs out and redirects to /login when the button is clicked', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
