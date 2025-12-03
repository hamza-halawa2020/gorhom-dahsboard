import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';

// Language
import { TranslateModule } from '@ngx-translate/core';

// Bootstap Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

// component
import { LayoutComponent } from './layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VerticalComponent } from './vertical/vertical.component';
import { FooterComponent } from './footer/footer.component';
import { CustomizerComponent } from './customizer/customizer.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { HorizontalTopbarComponent } from './horizontal-topbar/horizontal-topbar.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TopbarComponent,
    SidebarComponent,
    VerticalComponent,
    FooterComponent,
    CustomizerComponent,
    HorizontalComponent,
    HorizontalTopbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    SimplebarAngularModule,
    TranslateModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LayoutsModule {}
