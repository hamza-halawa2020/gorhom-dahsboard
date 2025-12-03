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
    const options = {
      expires: 1,
      secure: true,
      sameSite: 'Strict' as 'Strict',
      path: '/',
    };

    this.cookieService.set('token', token, options);
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
