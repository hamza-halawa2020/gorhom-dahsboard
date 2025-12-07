import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  fieldTextType!: boolean;
  returnUrl!: string;
  successMessage: string = '';
  errorMessage: string = '';
  toast!: false;

  year: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.loginForm.controls;
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.submitted = true;
      this.authenticationService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          
          // Try different possible token locations in response
          const token = res.token || res.data?.token || res.access_token || res.data?.access_token;
          
          if (token) {
            this.authenticationService.setTokenInCookie(token);
            this.router.navigate(['/']);
          } else {
            console.error('No token found in response:', res);
            this.errorMessage = 'Login succeeded but no token received';
            setTimeout(() => (this.errorMessage = ''), 10000);
          }
        },
        error: (err) => {
          this.errorMessage =
            'Login failed. Please try again. ' + this.extractErrorMessage(err);
          setTimeout(() => (this.errorMessage = ''), 10000);
        },
      });
    } else {
      this.errorMessage =
        'Form is invalid. Please fill all the required fields.';
      setTimeout(() => (this.errorMessage = ''), 10000);
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
