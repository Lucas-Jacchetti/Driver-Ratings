import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let routerEvents: Subject<unknown>;

  function emitNavigationEnd(url: string) {
    routerEvents.next(new NavigationEnd(1, url, url));
  }

  beforeEach(async () => {
    routerEvents = new Subject();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: Router, useValue: { events: routerEvents.asObservable() } }],
    }).compileComponents();
  });

  it('shows the shell by default', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.showShell()).toBe(true);
  });

  it('hides the shell on the /login route', () => {
    const fixture = TestBed.createComponent(AppComponent);

    emitNavigationEnd('/login');

    expect(fixture.componentInstance.showShell()).toBe(false);
  });

  it('shows the shell again after navigating away from /login', () => {
    const fixture = TestBed.createComponent(AppComponent);

    emitNavigationEnd('/login');
    expect(fixture.componentInstance.showShell()).toBe(false);

    emitNavigationEnd('/races');
    expect(fixture.componentInstance.showShell()).toBe(true);
  });

  it('closes the sidebar on every navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.sidebarOpen.set(true);

    emitNavigationEnd('/races');

    expect(fixture.componentInstance.sidebarOpen()).toBe(false);
  });

  it('ignores non-NavigationEnd router events', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.sidebarOpen.set(true);

    routerEvents.next({ id: 1, url: '/login' }); // not a NavigationEnd instance

    expect(fixture.componentInstance.sidebarOpen()).toBe(true);
    expect(fixture.componentInstance.showShell()).toBe(true);
  });
});
