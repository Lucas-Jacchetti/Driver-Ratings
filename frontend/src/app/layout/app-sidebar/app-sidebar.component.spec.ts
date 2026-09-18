import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { AppSidebarComponent } from './app-sidebar.component';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserResponseDTO } from '../../shared/models/user.model';

describe('AppSidebarComponent', () => {
  let fixture: ComponentFixture<AppSidebarComponent>;
  let component: AppSidebarComponent;
  let isAuthenticated: ReturnType<typeof signal<boolean>>;
  let isAdmin: ReturnType<typeof signal<boolean>>;
  let currentUser: ReturnType<typeof signal<UserResponseDTO | null>>;

  beforeEach(async () => {
    isAuthenticated = signal(false);
    isAdmin = signal(false);
    currentUser = signal<UserResponseDTO | null>(null);

    await TestBed.configureTestingModule({
      imports: [AppSidebarComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { isAuthenticated, isAdmin, currentUser },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the base nav items', () => {
    const text = fixture.nativeElement.textContent;
    for (const item of component.navItems) {
      expect(text).toContain(item.label);
    }
  });

  it('does not show the Admin link for non-admins', () => {
    isAdmin.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Admin');
  });

  it('shows the Admin link when the user is an admin', () => {
    isAdmin.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Admin');
  });

  it('hides the user info panel when logged out', () => {
    isAuthenticated.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('@');
  });

  it('shows the current user name and email when logged in', () => {
    isAuthenticated.set(true);
    currentUser.set({
      id: 'u1',
      name: 'Lucas',
      email: 'lucas@example.com',
      createdAt: '2026-01-01T00:00:00Z',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Lucas');
    expect(fixture.nativeElement.textContent).toContain('lucas@example.com');
  });

  it('computes the user initial from the first letter of the name, uppercased', () => {
    currentUser.set({
      id: 'u1',
      name: 'lucas',
      email: 'lucas@example.com',
      createdAt: '2026-01-01T00:00:00Z',
    });

    expect(component.userInitial()).toBe('L');
  });

  it('falls back to "?" for the initial when there is no current user', () => {
    currentUser.set(null);
    expect(component.userInitial()).toBe('?');
  });

  it('emits openChange(false) via close()', () => {
    const emitSpy = jest.spyOn(component.openChange, 'emit');

    component.close();

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('closes the sidebar when a nav link is clicked', () => {
    const emitSpy = jest.spyOn(component.openChange, 'emit');
    const link = fixture.debugElement.query(By.directive(RouterLink));

    link.triggerEventHandler('click', { button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, preventDefault: () => {} });

    expect(emitSpy).toHaveBeenCalledWith(false);
  });
});
