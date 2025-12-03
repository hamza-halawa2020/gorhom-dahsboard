import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Page Route
import { AuthRoutingModule } from './auth-routing.module';

// Component

import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [LogoutComponent],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
