import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  private readonly langParamValue = 'all';

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.shouldAppendLang(request)) {
      return next.handle(request);
    }

    const updatedRequest = request.clone({
      params: request.params.set('lang', this.langParamValue),
    });

    return next.handle(updatedRequest);
  }

  private shouldAppendLang(request: HttpRequest<unknown>): boolean {
    // Only target backend API calls
    if (!request.url.startsWith(environment.backEndUrl)) {
      return false;
    }

    // Skip if lang already present
    if (request.params.has('lang') || request.url.includes('lang=')) {
      return false;
    }

    // Only GET requests should carry lang parameter
    return request.method.toUpperCase() === 'GET';
  }
}
