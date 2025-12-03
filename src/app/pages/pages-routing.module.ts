import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
  },
  {
    path: 'apps',
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  },

  {
    path: 'pages',
    loadChildren: () =>
      import('./extrapages/extrapages.module').then((m) => m.ExtrapagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
