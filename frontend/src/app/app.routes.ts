import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'races',
    loadComponent: () =>
      import('./features/races/pages/races-page/races-page.component').then(
        (m) => m.RacesPageComponent
      ),
  },
  {
    path: 'races/:id',
    loadComponent: () =>
      import('./features/races/pages/race-detail-page/race-detail-page.component').then(
        (m) => m.RaceDetailPageComponent
      ),
  },
  {
    path: 'races/:id/rate',
    loadComponent: () =>
      import('./features/ratings/pages/rate-race-page/rate-race-page.component').then(
        (m) => m.RateRacePageComponent
      ),
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./features/drivers/pages/drivers-page/drivers-page.component').then(
        (m) => m.DriversPageComponent
      ),
  },
  {
    path: 'communities',
    loadComponent: () =>
      import('./features/communities/pages/communities-page/communities-page.component').then(
        (m) => m.CommunitiesPageComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/users/pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/users/pages/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent
      ),
  },
  {
    path: 'admin',
    //canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/pages/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'drivers' },
      {
        path: 'drivers',
        loadComponent: () =>
          import('./features/admin/pages/admin-drivers-page/admin-drivers-page.component').then(
            (m) => m.AdminDriversPageComponent
          ),
      },
      {
        path: 'teams',
        loadComponent: () =>
          import('./features/admin/pages/admin-teams-page/admin-teams-page.component').then(
            (m) => m.AdminTeamsPageComponent
          ),
      },
      {
        path: 'seasons',
        loadComponent: () =>
          import('./features/admin/pages/admin-seasons-page/admin-seasons-page.component').then(
            (m) => m.AdminSeasonsPageComponent
          ),
      },
      {
        path: 'races',
        loadComponent: () =>
          import('./features/admin/pages/admin-races-page/admin-races-page.component').then(
            (m) => m.AdminRacesPageComponent
          ),
      },
      {
        path: 'driver-seasons',
        loadComponent: () =>
          import(
            './features/admin/pages/admin-driver-seasons-page/admin-driver-seasons-page.component'
          ).then((m) => m.AdminDriverSeasonsPageComponent),
      },
      {
        path: 'race-results',
        loadComponent: () =>
          import(
            './features/admin/pages/admin-race-results-page/admin-race-results-page.component'
          ).then((m) => m.AdminRaceResultsPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
