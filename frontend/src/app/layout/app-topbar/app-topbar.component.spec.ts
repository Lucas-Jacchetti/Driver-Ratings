import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppTopbarComponent } from './app-topbar.component';

describe('AppTopbarComponent', () => {
  let fixture: ComponentFixture<AppTopbarComponent>;
  let component: AppTopbarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTopbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('greets the user by name', () => {
    expect(fixture.nativeElement.textContent).toContain(`Hello, ${component.userName}!`);
  });

  it('emits menuClick when the menu button is clicked', () => {
    const emitSpy = jest.spyOn(component.menuClick, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(emitSpy).toHaveBeenCalled();
  });
});
