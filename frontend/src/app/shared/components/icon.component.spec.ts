import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
  });

  it('defaults to no name and size 18', () => {
    expect(component.name).toBe('');
    expect(component.size).toBe(18);
  });

  it('applies the size input as the svg width/height', () => {
    component.size = 32;
    fixture.detectChanges();

    const svg = fixture.debugElement.query(By.css('svg')).nativeElement as SVGElement;
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('32');
  });

  it('renders the path matching the given icon name', () => {
    component.name = 'trash';
    fixture.detectChanges();

    const paths = fixture.debugElement.queryAll(By.css('path'));
    expect(paths.length).toBeGreaterThan(0);
  });

  it('renders nothing extra for an unknown icon name', () => {
    component.name = 'not-a-real-icon';
    fixture.detectChanges();

    const paths = fixture.debugElement.queryAll(By.css('path'));
    const circles = fixture.debugElement.queryAll(By.css('circle'));
    const rects = fixture.debugElement.queryAll(By.css('rect'));
    expect(paths.length + circles.length + rects.length).toBe(0);
  });
});
