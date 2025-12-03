import { Component } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../profile/profile.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent {
  id!: number;
  updateInfo: any;
  userInfo!: Profile;
  fieldTextType!: boolean;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;
  successMessage: string = '';
  errorMessage: string = '';
  image = environment.imgUrl + 'users/';

  formGroups: FormGroup[] = [];
  educationForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.show();

    this.updateInfo = this.formBuilder.group({
      id: [''],
      name: [''],
      email: ['', Validators.email],
      phone: [''],
      password: [''],
      password_confirmation: [''],
    });

    // Load user data into the form
    this.userService.profile().subscribe((data) => {
      this.userInfo = Object.values(data)[0];
      this.updateInfo.patchValue(this.userInfo); // Populate form with user data
    });
  }

  onSubmit() {
    // if (this.updateInfo.valid) {
    const data = this.updateInfo.value;

    // Ensure user id is included in the data object
    if (!data.id) {
      this.errorMessage = 'User ID is required for update ';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    this.userService.update(data).subscribe(
      (response) => {
        this.successMessage = 'User updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage = 'Update failed. ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
    // } else {
    //   this.errorMessage =
    //     'Form is invalid. Please fill all the required fields.';
    //   setTimeout(() => (this.errorMessage = ''), 3000);
    // }
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  show() {
    this.userService.profile().subscribe((data) => {
      this.userInfo = Object.values(data)[0];
    });
  }
  // File Upload
  imageURL: any;
  fileChange(event: any, id: any) {
    let fileList: any = event.target as HTMLInputElement;
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#user-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
    };

    reader.readAsDataURL(file);
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  // add Form
  addForm() {
    const formGroupClone = this.formBuilder.group(this.educationForm.value);
    this.formGroups.push(formGroupClone);
  }
}
