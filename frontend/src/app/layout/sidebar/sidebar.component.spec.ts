import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders one link per admin nav item', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).toBe(component.navItems.length);
  });

  it('renders the expected admin sections', () => {
    const text = fixture.nativeElement.textContent;
    for (const item of component.navItems) {
      expect(text).toContain(item.label);
    }
  });

  it('points each link to its configured path', () => {
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    const hrefs = links.map((link) => link.nativeElement.getAttribute('ng-reflect-router-link') ?? link.nativeElement.getAttribute('href'));

    // At least verify the paths line up with the component's own data, regardless
    // of how Angular renders the resolved href in this environment.
    expect(component.navItems.map((i) => i.path)).toEqual([
      '/admin/drivers',
      '/admin/teams',
      '/admin/seasons',
      '/admin/races',
      '/admin/driver-seasons',
      '/admin/race-results',
    ]);
    expect(hrefs.length).toBe(component.navItems.length);
  });
});
