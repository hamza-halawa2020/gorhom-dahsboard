import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { UserComponent } from './user/user.component';
import { CategoriesComponent } from './categories/categories.component';
// import { CertificationsComponent } from './certifications/certifications.component';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { ClientsComponent } from './clients/clients.component';
import { ShipmentsComponent } from './shipments/shipments.component';
// import { AddreesesComponent } from './addreeses/addreeses.component';
import { CouponsComponent } from './coupons/coupons.component';

import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { ReviewsComponent } from './reviews/reviews.component';
// import { SocialLinksComponent } from './social-links/social-links.component';
import { OrdersComponent } from './orders/orders.component';
import { PaymentsComponent } from './payments/payments.component';

const routes: Routes = [

  {
    path: 'coupons',
    component: CouponsComponent,
  },

  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'clients',
    component: ClientsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },

  {
    path: 'countries',
    component: CountriesComponent,
  },
  {
    path: 'cities',
    component: CitiesComponent,
  },
  {
    path: 'shipments',
    component: ShipmentsComponent,
  },

  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'product-review',
    component: ProductReviewComponent,
  },
  {
    path: 'products/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'reviews',
    component: ReviewsComponent,
  },

  {
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule { }
