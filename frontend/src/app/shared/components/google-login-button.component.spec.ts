import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GoogleLoginButtonComponent } from './google-login-button.component';
import { AuthService } from '../../features/auth/services/auth.service';

describe('GoogleLoginButtonComponent', () => {
  let fixture: ComponentFixture<GoogleLoginButtonComponent>;
  let authServiceMock: { loginWithGoogle: jest.Mock };

  afterEach(() => {
    delete (global as any).google;
    jest.useRealTimers();
  });

  async function createFixture() {
    authServiceMock = { loginWithGoogle: jest.fn().mockReturnValue(of({})) };

    await TestBed.configureTestingModule({
      imports: [GoogleLoginButtonComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleLoginButtonComponent);
  }

  it('initializes and renders the Google button immediately when the SDK is already loaded', async () => {
    (global as any).google = {
      accounts: { id: { initialize: jest.fn(), renderButton: jest.fn() } },
    };

    await createFixture();
    fixture.detectChanges();

    expect((global as any).google.accounts.id.initialize).toHaveBeenCalledWith(
      expect.objectContaining({ client_id: expect.any(String) })
    );
    expect((global as any).google.accounts.id.renderButton).toHaveBeenCalledWith(
      fixture.componentInstance.buttonContainer.nativeElement,
      expect.objectContaining({ theme: 'filled_black' })
    );
  });

  it('calls AuthService.loginWithGoogle when the SDK invokes the initialize callback', async () => {
    let capturedCallback!: (response: { credential: string }) => void;
    (global as any).google = {
      accounts: {
        id: {
          initialize: jest.fn((config: any) => {
            capturedCallback = config.callback;
          }),
          renderButton: jest.fn(),
        },
      },
    };

    await createFixture();
    fixture.detectChanges();

    capturedCallback({ credential: 'id-token-abc' });

    expect(authServiceMock.loginWithGoogle).toHaveBeenCalledWith('id-token-abc');
  });

  it('polls until the Google SDK becomes available', async () => {
    jest.useFakeTimers();
    await createFixture();
    fixture.detectChanges();

    // SDK not ready yet: nothing should have been called.
    expect(document.title).toBeDefined(); // sanity check environment is alive

    (global as any).google = {
      accounts: { id: { initialize: jest.fn(), renderButton: jest.fn() } },
    };

    jest.advanceTimersByTime(100);

    expect((global as any).google.accounts.id.initialize).toHaveBeenCalled();
    expect((global as any).google.accounts.id.renderButton).toHaveBeenCalled();
  });

  it('gives up polling after too many attempts without the SDK ever loading', async () => {
    jest.useFakeTimers();
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    await createFixture();
    fixture.detectChanges();

    jest.advanceTimersByTime(41 * 100);

    // 40 retries after the initial synchronous check, then it stops scheduling more.
    const scheduledCount = setTimeoutSpy.mock.calls.length;
    jest.advanceTimersByTime(1000);
    expect(setTimeoutSpy.mock.calls.length).toBe(scheduledCount);
  });
});
