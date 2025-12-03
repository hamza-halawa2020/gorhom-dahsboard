import { Component } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/user.service';
import { Profile } from './profile.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  userInfo!: Profile;
  image = environment.imgUrl + 'users/';

  constructor(private userService: UserProfileService) {}

  ngOnInit(): void {
    this.show();
  }

  show() {
    this.userService.profile().subscribe((data) => {
      this.userInfo = Object.values(data)[0];
      // console.log(this.userInfo);
    });
  }
}
