import { signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommunitiesPageComponent } from './communities-page.component';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { CommunityResponseDTO, PagedResult } from '../../models/community.model';
import { UserResponseDTO } from '../../../../shared/models/user.model';

describe('CommunitiesPageComponent (integration)', () => {
  let fixture: ComponentFixture<CommunitiesPageComponent>;
  let component: CommunitiesPageComponent;
  let httpMock: HttpTestingController;
  let currentUser: ReturnType<typeof signal<UserResponseDTO | null>>;

  const communityUrl = `${environment.apiUrl}/community`;
  const memberUrl = `${environment.apiUrl}/communitymember`;

  function community(overrides: Partial<CommunityResponseDTO> = {}): CommunityResponseDTO {
    return {
      id: 'c1',
      name: 'Fórmula BR',
      accessCode: 'ABC123',
      description: 'Comunidade brasileira',
      host: { id: 'host-1', name: 'Host' },
      isPublic: true,
      imgUrl: null,
      members: [{ id: 'm1', communityId: 'c1', community: 'c1', user: { id: 'host-1', name: 'Host' }, joinedAt: '2026-01-01' }],
      createdAt: '2026-01-01T00:00:00Z',
      ...overrides,
    };
  }

  function pagedResult(items: CommunityResponseDTO[]): PagedResult<CommunityResponseDTO> {
    return { items, totalCount: items.length, page: 1, pageSize: 20, totalPages: 1 };
  }

  beforeEach(async () => {
    currentUser = signal<UserResponseDTO | null>(null);

    await TestBed.configureTestingModule({
      imports: [CommunitiesPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { currentUser } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunitiesPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  function flushAllCommunities(items: CommunityResponseDTO[] = []) {
    httpMock
      .expectOne((r) => r.url === communityUrl && r.params.get('page') === '1')
      .flush(pagedResult(items));
  }

  it('loads all communities (paged) on init', () => {
    fixture.detectChanges();
    flushAllCommunities([community()]);

    expect(component.loading).toBe(false);
    expect(component.communities.length).toBe(1);
  });

  it('stops loading when the initial load fails', () => {
    fixture.detectChanges();
    httpMock
      .expectOne((r) => r.url === communityUrl)
      .flush('err', { status: 500, statusText: 'Server Error' });

    expect(component.loading).toBe(false);
  });

  it('setView("Mine") loads the plain array from getMy() instead of a paged result', () => {
    fixture.detectChanges();
    flushAllCommunities([]);

    component.setView('Mine');

    const req = httpMock.expectOne(`${communityUrl}/my`);
    req.flush([community({ id: 'c2' })]);

    expect(component.activeView).toBe('Mine');
    expect(component.communities.map((c) => c.id)).toEqual(['c2']);
  });

  describe('membership helpers', () => {
    it('isMember()/isHost()/canOpenRatings() are false when logged out', () => {
      const c = community();
      expect(component.isMember(c)).toBe(false);
      expect(component.isHost(c)).toBe(false);
      expect(component.canOpenRatings(c)).toBe(false);
    });

    it('isHost() is true for the community host', () => {
      currentUser.set({ id: 'host-1', name: 'Host', email: 'h@x.com', createdAt: '2026-01-01' });
      const c = community();
      expect(component.isHost(c)).toBe(true);
      expect(component.canOpenRatings(c)).toBe(true);
    });

    it('isMember() is true when the user is in the members list but not the host', () => {
      currentUser.set({ id: 'member-1', name: 'Member', email: 'm@x.com', createdAt: '2026-01-01' });
      const c = community({
        members: [{ id: 'm1', communityId: 'c1', community: 'c1', user: { id: 'member-1', name: 'Member' }, joinedAt: '2026-01-01' }],
      });
      expect(component.isMember(c)).toBe(true);
      expect(component.isHost(c)).toBe(false);
      expect(component.canOpenRatings(c)).toBe(true);
    });
  });

  it('onCardClick() only opens the ratings view when allowed', () => {
    const c = community();

    component.onCardClick(c);
    expect(component.selectedCommunity).toBeNull();

    currentUser.set({ id: 'host-1', name: 'Host', email: 'h@x.com', createdAt: '2026-01-01' });
    component.onCardClick(c);
    expect(component.selectedCommunity).toBe(c);
  });

  it('joinCommunity() closes the modal, shows a toast and reloads on success', fakeAsync(() => {
    fixture.detectChanges();
    flushAllCommunities([]);

    component.showJoinModal = true;
    component.accessCode = 'CODE1';
    const c = community({ id: 'c9' });

    component.joinCommunity(c, 'CODE1');

    const req = httpMock.expectOne(memberUrl);
    expect(req.request.body).toEqual({ communityId: 'c9', accessToken: 'CODE1' });
    req.flush(null);

    expect(component.showJoinModal).toBe(false);
    expect(component.toastMessage).toBe('You joined Fórmula BR!');

    flushAllCommunities([c]);
    expect(component.communities.map((x) => x.id)).toEqual(['c9']);
    tick(3000);
    expect(component.toastMessage).toBe('');
  }));

  it('joinCommunity() sets codeError on failure', () => {
    fixture.detectChanges();
    flushAllCommunities([]);

    component.joinCommunity(community());
    httpMock.expectOne(memberUrl).flush('err', { status: 400, statusText: 'Bad Request' });

    expect(component.codeError).toBe('Failed to join community.');
  });

  it('leaveCommunity() shows a toast and reloads on success', () => {
    fixture.detectChanges();
    flushAllCommunities([]);

    const c = community();
    component.leaveCommunity(c);

    const req = httpMock.expectOne(`${memberUrl}/c1/members/me`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(component.toastMessage).toBe('You left Fórmula BR.');
    flushAllCommunities([]);
  });

  it('leaveCommunity() shows a failure toast on error', () => {
    fixture.detectChanges();
    flushAllCommunities([]);

    component.leaveCommunity(community());
    httpMock.expectOne(`${memberUrl}/c1/members/me`).flush('err', { status: 500, statusText: 'Server Error' });

    expect(component.toastMessage).toBe('Failed to leave community.');
  });

  it('closeJoinModal() resets the join modal state', () => {
    component.showJoinModal = true;
    component.accessCode = 'X';
    component.codeError = 'oops';
    component.foundCommunity = community();

    component.closeJoinModal();

    expect(component.showJoinModal).toBe(false);
    expect(component.accessCode).toBe('');
    expect(component.codeError).toBe('');
    expect(component.foundCommunity).toBeNull();
  });

  it('searchByCode() sets foundCommunity on success and codeError on failure', () => {
    fixture.detectChanges();
    flushAllCommunities([]);

    component.accessCode = 'ABC123';
    component.searchByCode();
    let req = httpMock.expectOne(`${communityUrl}/by-code/ABC123`);
    const c = community();
    req.flush(c);
    expect(component.foundCommunity).toEqual(c);

    component.searchByCode();
    req = httpMock.expectOne(`${communityUrl}/by-code/ABC123`);
    req.flush('err', { status: 404, statusText: 'Not Found' });
    expect(component.codeError).toBe('Invalid Code.');
  });

  describe('create flow', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushAllCommunities([]);
    });

    it('does not submit without a name or a chosen visibility', () => {
      component.createForm = { name: '', description: '', imgUrl: null };
      component.createVisibility = 'public';
      component.submitCreate();
      httpMock.expectNone((req) => req.method === 'POST' && req.url === communityUrl);

      component.createForm = { name: 'Nova', description: '', imgUrl: null };
      component.createVisibility = '';
      component.submitCreate();
      httpMock.expectNone((req) => req.method === 'POST' && req.url === communityUrl);
    });

    it('trims fields, submits and shows a toast only for public communities', () => {
      component.createForm = { name: '  Nova Comunidade  ', description: '  desc  ', imgUrl: '  ' };
      component.createVisibility = 'public';
      component.submitCreate();

      expect(component.creating).toBe(true);
      const req = httpMock.expectOne(communityUrl);
      expect(req.request.body).toEqual({
        name: 'Nova Comunidade',
        description: 'desc',
        isPublic: true,
        imgUrl: null,
      });

      const created = community({ id: 'new1', name: 'Nova Comunidade', isPublic: true });
      req.flush(created);

      expect(component.creating).toBe(false);
      expect(component.createdCommunity).toEqual(created);
      expect(component.toastMessage).toBe('Community Nova Comunidade created!');
    });

    it('does not toast for a private community', () => {
      component.createForm = { name: 'Privada', description: '', imgUrl: null };
      component.createVisibility = 'private';
      component.submitCreate();

      const req = httpMock.expectOne(communityUrl);
      expect(req.request.body.isPublic).toBe(false);
      req.flush(community({ id: 'new2', isPublic: false }));

      expect(component.toastMessage).toBe('');
    });

    it('sets createError on failure', () => {
      component.createForm = { name: 'Falha', description: '', imgUrl: null };
      component.createVisibility = 'public';
      component.submitCreate();

      httpMock.expectOne(communityUrl).flush('err', { status: 500, statusText: 'Server Error' });

      expect(component.createError).toBe('Failed to create community.');
      expect(component.creating).toBe(false);
    });

    it('closeCreateModal() resets state and reloads only if a community was created', () => {
      component.showCreateModal = true;
      component.createdCommunity = null;
      component.closeCreateModal();
      expect(component.showCreateModal).toBe(false);
      httpMock.expectNone((req) => req.url === communityUrl && req.method === 'GET');

      component.createdCommunity = community();
      component.closeCreateModal();
      flushAllCommunities([]);
    });
  });

  describe('edit flow', () => {
    beforeEach(() => {
      fixture.detectChanges();
      flushAllCommunities([]);
    });

    it('openEditModal() populates the form from the given community', () => {
      const c = community({ description: 'Desc', imgUrl: 'http://img', isPublic: false });
      component.openEditModal(c);

      expect(component.editForm).toEqual({ name: 'Fórmula BR', description: 'Desc', imgUrl: 'http://img' });
      expect(component.editVisibility).toBe('private');
      expect(component.showEditModal).toBe(true);
    });

    it('does not submit without an editing community or a blank name', () => {
      component.editingCommunity = null;
      component.editForm = { name: 'X' };
      component.submitEdit();
      httpMock.expectNone((req) => req.method === 'PATCH');

      component.editingCommunity = community();
      component.editForm = { name: '   ' };
      component.submitEdit();
      httpMock.expectNone((req) => req.method === 'PATCH');
    });

    it('submits the edit, toasts, closes the modal and reloads on success', () => {
      component.editingCommunity = community();
      component.editForm = { name: '  Novo Nome  ', description: '  ', imgUrl: '  ' };
      component.editVisibility = 'private';

      component.submitEdit();

      const req = httpMock.expectOne(`${communityUrl}/c1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        name: 'Novo Nome',
        description: undefined,
        imgUrl: undefined,
        isPublic: false,
      });

      req.flush(community({ name: 'Novo Nome' }));

      expect(component.toastMessage).toBe('Community Novo Nome updated!');
      expect(component.showEditModal).toBe(false);
      expect(component.editingCommunity).toBeNull();

      flushAllCommunities([]);
    });

    it('sets editError on failure', () => {
      component.editingCommunity = community();
      component.editForm = { name: 'Nome' };
      component.editVisibility = 'public';
      component.submitEdit();

      httpMock.expectOne(`${communityUrl}/c1`).flush('err', { status: 500, statusText: 'Server Error' });

      expect(component.editError).toBe('Failed to update community.');
      expect(component.updating).toBe(false);
    });
  });

  it('copyAccessCode() copies the code and shows a toast', fakeAsync(() => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    component.copyAccessCode('CODE123');
    tick();

    expect(writeText).toHaveBeenCalledWith('CODE123');
    expect(component.toastMessage).toBe('Access code copied!');
  }));

  it('copyAccessCode() does nothing for a null code', () => {
    const writeText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    component.copyAccessCode(null);

    expect(writeText).not.toHaveBeenCalled();
  });

  it('filteredCommunities filters case-insensitively by name', () => {
    component.communities = [community({ id: 'a', name: 'Fórmula BR' }), community({ id: 'b', name: 'Racing Club' })];

    component.search = 'formula';
    expect(component.filteredCommunities.map((c) => c.id)).toEqual([]); // accents are not folded

    component.search = 'órmula';
    expect(component.filteredCommunities.map((c) => c.id)).toEqual(['a']);

    component.search = 'RACING';
    expect(component.filteredCommunities.map((c) => c.id)).toEqual(['b']);
  });
});
