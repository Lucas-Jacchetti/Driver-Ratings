import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  template: `<div #buttonContainer></div>`,
})
export class GoogleLoginButtonComponent implements AfterViewInit {
  @ViewChild('buttonContainer', { static: true }) buttonContainer!: ElementRef<HTMLDivElement>;
  private authService = inject(AuthService);

  ngAfterViewInit(): void {
    this.whenGoogleReady(() => {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: { credential: string }) =>
          this.authService.loginWithGoogle(response.credential).subscribe(),
      });

      google.accounts.id.renderButton(this.buttonContainer.nativeElement, {
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
      });
    });
  }

  private whenGoogleReady(callback: () => void, attempt = 0): void {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      callback();
      return;
    }
    if (attempt > 40) return;
    setTimeout(() => this.whenGoogleReady(callback, attempt + 1), 100);
  }
}