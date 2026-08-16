import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    //ScanActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'races',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/races/pages/races-page/races-page.component').then(
        (m) => m.RacesPageComponent
      ),
  },
  {
    path: 'races/:id',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/races/pages/race-detail-page/race-detail-page.component').then(
        (m) => m.RaceDetailPageComponent
      ),
  },
  {
    path: 'races/:id/rate',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/ratings/pages/rate-race-page/rate-race-page.component').then(
        (m) => m.RateRacePageComponent
      ),
  },
  {
    path: 'drivers',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/drivers/pages/drivers-page/drivers-page.component').then(
        (m) => m.DriversPageComponent
      ),
  },
  {
    path: 'seasons',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/seasons/pages/seasons-page/seasons-page.component').then(
        (m) => m.SeasonsPageComponent
      ),
  },
  {
    path: 'communities',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/communities/pages/communities-page/communities-page.component').then(
        (m) => m.CommunitiesPageComponent
      ),
  },
  {
    path: 'profile',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: 'settings',
    //canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/pages/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
