import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
  { path: '**', redirectTo: '' },
];
