import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RootReducerState, getLayoutMode } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { changeMode } from 'src/app/store/actions/layout-action';
import { Profile } from 'src/app/pages/extrapages/profile/profile.model';
import { environment } from 'src/environments/environment';
import { UserProfileService } from 'src/app/core/services/user.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})

// Topbar Component
export class TopbarComponent {
  userInfo!: Profile;
  image = environment.imgUrl + 'users/';
  country: any;
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  element: any;
  mode: string | undefined;
  fullscreenicon: any = 'arrows-maximize';
  @Output() mobileMenuButtonClicked = new EventEmitter();
  constructor(
    @Inject(DOCUMENT) private document: any,
    private store: Store<RootReducerState>,
    public _cookiesService: CookieService,
    private userService: UserProfileService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.show();

    this.element = document.documentElement;
  }

  logout() {
    this.authService.logout();
  }
  show() {
    this.userService.profile().subscribe((data) => {
      this.userInfo = Object.values(data)[0];
      // console.log(this.userInfo);
    });
  }

  windowScroll() {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      (document.getElementById('back-to-top') as HTMLElement).style.display =
        'block';
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById('back-to-top') as HTMLElement).style.display =
        'none';
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }


  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    document.body.classList.contains('twocolumn-panel')
      ? document.body.classList.remove('twocolumn-panel')
      : document.body.classList.add('twocolumn-panel');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((mode) => {
      document.documentElement.setAttribute('data-bs-theme', mode);
      document.documentElement.classList.remove('mode-auto');
    });
    if (mode == 'auto') {
      this.store.select(getLayoutMode).subscribe((mode) => {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.documentElement.classList.add('mode-auto');
      });
    }
  }
}
