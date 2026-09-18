import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthGateComponent } from './auth-gate.component';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  standalone: true,
  imports: [AuthGateComponent],
  template: `<app-auth-gate [message]="message"><p class="protected-content">Secret content</p></app-auth-gate>`,
})
class HostComponent {
  message = 'Faça login para continuar.';
}

describe('AuthGateComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let authServiceMock: { isAuthenticated: jest.Mock };

  beforeAll(() => {
    // The nested GoogleLoginButtonComponent talks to the real Google Identity
    // Services script; stub it out so ngAfterViewInit resolves synchronously.
    (global as any).google = {
      accounts: { id: { initialize: jest.fn(), renderButton: jest.fn() } },
    };
  });

  afterAll(() => {
    delete (global as any).google;
  });

  beforeEach(async () => {
    authServiceMock = { isAuthenticated: jest.fn().mockReturnValue(false) };

    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  function createFixture() {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  }

  it('shows the login prompt (not the projected content) when unauthenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    createFixture();

    expect(fixture.debugElement.query(By.css('.protected-content'))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Faça login para continuar.');
  });

  it('shows the projected content when authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    createFixture();

    expect(fixture.debugElement.query(By.css('.protected-content'))).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Secret content');
  });

  it('falls back to the default message when none is provided', () => {
    @Component({
      standalone: true,
      imports: [AuthGateComponent],
      template: `<app-auth-gate><span>content</span></app-auth-gate>`,
    })
    class DefaultMessageHost {}

    authServiceMock.isAuthenticated.mockReturnValue(false);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DefaultMessageHost],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    const defaultFixture = TestBed.createComponent(DefaultMessageHost);
    defaultFixture.detectChanges();

    expect(defaultFixture.nativeElement.textContent).toContain(
      'Você precisa estar logado pra ver isso.'
    );
  });
});
