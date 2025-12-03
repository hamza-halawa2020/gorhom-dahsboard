import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages

import { ProfileComponent } from './profile/profile.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraPagesRoutingModule {}
