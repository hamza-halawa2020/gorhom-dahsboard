import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Page Route
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './layouts/layouts.module';

// Language
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Auth
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

// Store
import { StoreModule } from '@ngrx/store';
import { rootReducer } from 'src/app/store/reducers';

// Component
import { AppComponent } from './app.component';

import { CookieService } from 'ngx-cookie-service';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    StoreModule.forRoot(rootReducer),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
