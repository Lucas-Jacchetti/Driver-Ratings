import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    fixture.detectChanges();
  });

  it('renders a spinner element', () => {
    const spinner = fixture.debugElement.query(By.css('.animate-spin'));
    expect(spinner).toBeTruthy();
  });
});
