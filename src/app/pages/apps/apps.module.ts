import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';

// Language
import { TranslateModule } from '@ngx-translate/core';

// Bootstrap modules
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AlertModule } from 'ngx-bootstrap/alert';
import { RatingModule } from 'ngx-bootstrap/rating';
// Routing and components
import { AppsRoutingModule } from './apps-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserComponent } from './user/user.component';
import { CategoriesComponent } from './categories/categories.component';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { ClientsComponent } from './clients/clients.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { CouponsComponent } from './coupons/coupons.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductReviewComponent } from './product-review/product-review.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { OrdersComponent } from './orders/orders.component';
import { JwtInterceptor } from 'src/app/core/helpers/jwt.interceptor';

@NgModule({
  declarations: [

    CouponsComponent,
    UserComponent,
    ClientsComponent,
    CountriesComponent,
    CitiesComponent,
    ShipmentsComponent,
    CategoriesComponent,
    ProductsComponent,
    ProductDetailsComponent,
    ProductReviewComponent,
    ReviewsComponent,
    OrdersComponent,
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RatingModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    PaginationModule,
    ProgressbarModule,
    DragDropModule,
    MatTableModule,
    SharedModule,
    AlertModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
})
export class AppsModule {
  constructor() { }
}
