import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { AdminTeamsPageComponent } from './admin-teams-page.component';
import { environment } from '../../../../../environments/environment';
import { TeamResponseDTO } from '../../../../shared/models/team.model';

describe('AdminTeamsPageComponent (integration)', () => {
  let fixture: ComponentFixture<AdminTeamsPageComponent>;
  let component: AdminTeamsPageComponent;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/team`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTeamsPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTeamsPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushInitialLoad(teams: TeamResponseDTO[] = []) {
    httpMock.expectOne(baseUrl).flush(teams);
  }

  it('loads and displays the teams on init', () => {
    fixture.detectChanges(); // triggers ngOnInit -> load()

    flushInitialLoad([
      { id: '1', name: 'Ferrari' },
      { id: '2', name: 'McLaren' },
    ]);
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.teams().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Ferrari');
    expect(fixture.nativeElement.textContent).toContain('McLaren');
  });

  it('shows the empty state when there are no teams', () => {
    fixture.detectChanges();
    flushInitialLoad([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No teams registered yet.');
  });

  it('stops loading even if the initial request fails', () => {
    fixture.detectChanges();

    httpMock.expectOne(baseUrl).flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
  });

  it('does not submit the create form when the name is blank', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.name = '   ';
    component.create();

    httpMock.expectNone((req) => req.method === 'POST');
  });

  it('creates a team, clears the form and reloads the list', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.name = 'Red Bull';
    component.create();

    expect(component.creating()).toBe(true);

    const createReq = httpMock.expectOne(baseUrl);
    expect(createReq.request.method).toBe('POST');
    expect(createReq.request.body).toEqual({ name: 'Red Bull' });
    createReq.flush({ id: '3', name: 'Red Bull' });

    expect(component.form.name).toBe('');
    expect(component.creating()).toBe(false);

    // create() triggers a reload
    flushInitialLoad([{ id: '3', name: 'Red Bull' }]);
    expect(component.teams().length).toBe(1);
  });

  it('surfaces the API error message when creating a team fails', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.name = 'Broken Team';
    component.create();

    const createReq = httpMock.expectOne(baseUrl);
    createReq.flush({ error: 'Team name already exists.' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Team name already exists.');
    expect(component.creating()).toBe(false);
  });

  it('falls back to a generic message when the API gives no error detail', () => {
    fixture.detectChanges();
    flushInitialLoad([]);

    component.form.name = 'Broken Team';
    component.create();

    const createReq = httpMock.expectOne(baseUrl);
    createReq.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.errorMessage()).toBe('Could not create the team.');
  });

  it('deletes a team and reloads the list', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Ferrari' }]);
    fixture.detectChanges();

    component.delete('1');

    const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    flushInitialLoad([]);
    expect(component.teams().length).toBe(0);
  });

  it('surfaces the API error message when deleting a team fails', () => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Ferrari' }]);

    component.delete('1');

    const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
    deleteReq.flush({ error: 'Team is still in use.' }, { status: 409, statusText: 'Conflict' });

    expect(component.errorMessage()).toBe('Team is still in use.');
  });

  it('lets the user delete a team by clicking the trash button in the rendered list', fakeAsync(() => {
    fixture.detectChanges();
    flushInitialLoad([{ id: '1', name: 'Ferrari' }]);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[type="button"]'));
    deleteButton.triggerEventHandler('click', null);
    tick();

    const deleteReq = httpMock.expectOne(`${baseUrl}/1`);
    deleteReq.flush(null);
    flushInitialLoad([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No teams registered yet.');
  }));
});
