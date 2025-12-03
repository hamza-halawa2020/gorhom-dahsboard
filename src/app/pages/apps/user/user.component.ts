import { Component } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  image = environment.imgUrl + 'users/';
  totalPages: number = 0;
  currentPage: number = 1;
  users: User[] = [];
  newUser: User = {};
  editUserData: User = {};
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(private usersService: UserProfileService) {}

  ngOnInit(): void {
    this.index();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addUser(): void {
    const formData = new FormData();
    formData.append('name', this.newUser.name || '');
    formData.append('phone', this.newUser.phone || '');
    formData.append('email', this.newUser.email || '');

    this.usersService.store(formData).subscribe(
      () => {
        this.index();
        this.newUser = {};
        this.successMessage = 'User added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add user: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.usersService.index().subscribe((data) => {
      this.users = Object.values(data)[0];
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.index();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.index();
    }
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    this.usersService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'User deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete user: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditUserModal(user: User): void {
    this.editUserData = { ...user };
  }

  editUser(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid user ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editUserData.name) {
      formData.append('name', this.editUserData.name || '');
    }
    if (this.editUserData.phone) {
      formData.append('phone', this.editUserData.phone || '');
    }

    this.usersService.updateUser(id, formData).subscribe(
      () => {
        this.index();
        this.editUserData = {};
        this.selectedFile = null; 
        this.successMessage = 'User updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating user: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleType(user: any): void {
    const updatedType = user.type === 'admin' ? 'user' : 'admin';
    this.usersService
      .update({
        id: user.id,
        type: updatedType,
      })
      .subscribe(
        () => {
          user.type = updatedType;
          this.successMessage = 'User type updated successfully!';
          setTimeout(() => (this.successMessage = ''), 3000);
        },
        (error) => {
          this.errorMessage =
            'Error updating user type: ' + this.extractErrorMessage(error);
          setTimeout(() => (this.errorMessage = ''), 3000);
        }
      );
  }
}