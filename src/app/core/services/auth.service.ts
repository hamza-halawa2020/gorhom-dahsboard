import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private apiUrl = environment.backEndUrl;

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(userData: any) {
    return this.http.post(`${this.apiUrl}/login`, userData, {
      withCredentials: true,
    });
  }

  setTokenInCookie(token: string) {
    
    if (!token || token === 'undefined' || token === 'null') {
      console.error('Invalid token received:', token);
      return;
    }
    
    // Use secure cookies only in production / HTTPS. In dev (http) set secure=false
    const secureFlag = !!(typeof window !== 'undefined' && window.location.protocol === 'https:') && !!(environment.production);
    const sameSiteVal = environment.production ? ('Strict' as const) : ('Lax' as const);

    // ngx-cookie-service set signature may vary by version. We'll call set with explicit args
    // expires: number of days
    this.cookieService.set('token', token, 1, '/', undefined, secureFlag, sameSiteVal as any);
    
    // Verify it was set
    const savedToken = this.cookieService.get('token');
    
    // Fallback to localStorage if cookie fails
    if (!savedToken) {
      console.warn('Cookie failed, using localStorage fallback');
      localStorage.setItem('token', token);
    }
  }

  isLoggedIn() {
    return this.getTokenFromCookie();
  }

  getTokenFromCookie(): any {
    return this.cookieService.get('token');
  }

  logout() {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.clearTokenAndRedirect();
        },
        error: (err) => {
          this.clearTokenAndRedirect();
        },
      });
  }

  private clearTokenAndRedirect() {
    this.cookieService.delete('token', '/');
    this.router.navigate(['/auth/login']);
  }
}
