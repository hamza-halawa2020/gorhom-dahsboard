import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { ContactsComponent } from './contacts/contacts.component';
import { UserComponent } from './user/user.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { AddSidebarBannersComponent } from './add-sidebar-banners/add-sidebar-banners.component';
import { CertificationsComponent } from './certifications/certifications.component';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { ClientsComponent } from './clients/clients.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { AddreesesComponent } from './addreeses/addreeses.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseReviewComponent } from './course-review/course-review.component';
import { EventsComponent } from './events/events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { FaqsComponent } from './faqs/faqs.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { MainSlidersComponent } from './main-sliders/main-sliders.component';
import { PostsComponent } from './posts/posts.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { SocialLinksComponent } from './social-links/social-links.component';
import { OrdersComponent } from './orders/orders.component';
import { PaymentsComponent } from './payments/payments.component';
import { TranslateComponent } from './translate/translate.component';

const routes: Routes = [
  {
    path: 'ad-side-bar-banners',
    component: AddSidebarBannersComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'events/:id',
    component: EventDetailsComponent,
  },
  {
    path: 'coupons',
    component: CouponsComponent,
  },
  {
    path: 'courses',
    component: CoursesComponent,
  },
  {
    path: 'course-review',
    component: CourseReviewComponent,
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
    path: 'certifications',
    component: CertificationsComponent,
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
    path: 'addreeses',
    component: AddreesesComponent,
  },

  {
    path: 'tags',
    component: TagsComponent,
  },
  {
    path: 'contacts',
    component: ContactsComponent,
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'instructors',
    component: InstructorsComponent,
  },
  {
    path: 'main-sliders',
    component: MainSlidersComponent,
  },
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'posts/:postId',
    component: PostCommentComponent,
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
    path: 'social-links',
    component: SocialLinksComponent,
  },
  { 
    path: 'orders',
    component: OrdersComponent,
  },
  {
    path: 'payments',
    component: PaymentsComponent,
  },
  {
    path: 'translates',
    component: TranslateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
