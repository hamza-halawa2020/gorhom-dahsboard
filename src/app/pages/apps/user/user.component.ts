import { Component, ViewChild } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  @ViewChild('userModal') userModal!: ModalDirective;
  @ViewChild('deleteModal') deleteModal!: ModalDirective;

  users: any[] = [];
  currentPage = 1;
  totalPages = 1;

  isEditMode = false;
  userToDelete: number | null = null;

  imageFile: File | null = null;
  currentUserImage: string = '';
  imageUrl = environment.imgUrl + 'users/';

  // Image preview & loading
  imagePreview: string | null = null;
  isUploading = false;

  form: any = {
    id: null,
    name: '',
    email: '',
    phone: '',
    password: ''
  };

  successMessage = '';
  errorMessage = '';

  constructor(private usersService: UserProfileService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.index(this.currentPage).subscribe({
      next: (res: any) => {
        this.users = res.data || res;
        this.totalPages = res.last_page || 1;
        this.currentPage = res.current_page || 1;
      },
      error: (err) => {
        console.error('Load users error:', err);
        if (err.status === 401) {
          this.errorMessage = 'USERS.SESSION_EXPIRED';
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 2000);
        } else {
          this.errorMessage = 'USERS.FAILED_TO_LOAD_USERS';
        }
      }
    });
  }

  nextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.loadUsers(); } }
  previousPage() { if (this.currentPage > 1) { this.currentPage--; this.loadUsers(); } }
  goToPage(page: number) { this.currentPage = page; this.loadUsers(); }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement | null;
  }

  removeImagePreview() {
    this.imageFile = null;
    this.imagePreview = null;
  }

  saveUser() {
    // Validation
    if (!this.form.name) {
      this.errorMessage = 'USERS.NAME_REQUIRED';
      return;
    }
    if (!this.form.email && !this.isEditMode) {
      this.errorMessage = 'USERS.EMAIL_REQUIRED';
      return;
    }
    if (!this.form.password && !this.isEditMode) {
      this.errorMessage = 'USERS.PASSWORD_REQUIRED';
      return;
    }
    if (this.form.password && this.form.password.length < 6) {
      this.errorMessage = 'USERS.PASSWORD_MIN_6';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.name);
    if (this.form.email && !this.isEditMode) {
      formData.append('email', this.form.email);
    }
    if (this.form.password && !this.isEditMode) {
      formData.append('password', this.form.password);
    }
    if (this.form.phone) {
      formData.append('phone', this.form.phone);
    }
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.isUploading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      formData.append('_method', 'PUT');
      this.usersService.updateUser(this.form.id, formData).subscribe({
        next: () => this.afterSave('USERS.USER_UPDATED_SUCCESS'),
        error: (err) => {
          console.error('Update error', err);
          if (err.status === 401) {
            this.errorMessage = 'USERS.SESSION_EXPIRED';
          } else {
            this.errorMessage = err.error?.message || 'USERS.UPDATE_FAILED';
          }
          this.isUploading = false;
        }
      });
    } else {
      this.usersService.store(formData).subscribe({
        next: () => this.afterSave('USERS.USER_CREATED_SUCCESS'),
        error: (err) => {
          console.error('Create error', err);
          if (err.status === 401) {
            this.errorMessage = 'USERS.SESSION_EXPIRED';
          } else {
            this.errorMessage = err.error?.message || 'USERS.CREATE_FAILED';
          }
          this.isUploading = false;
        }
      });
    }
  }

  afterSave(msg: string) {
    this.isUploading = false;
    this.successMessage = msg;
    setTimeout(() => this.successMessage = '', 4000);
    this.userModal.hide();
    this.loadUsers();
    this.resetForm();
  }

  openCreateModal() {
    this.resetForm();
    this.userModal.show();
  }

  openEditUserModal(user: any) {
    this.isEditMode = true;
    this.errorMessage = '';
    
    // Fetch full user details
    this.usersService.show(user.id).subscribe({
      next: (res: any) => {
        const fullUser = res.data || res;
        this.form = {
          id: fullUser.id,
          name: fullUser.name || '',
          email: fullUser.email || '',
          phone: fullUser.phone || '',
          password: ''
        };
        this.imageFile = null;
        this.imagePreview = null;
        this.currentUserImage = fullUser.image || '';
        this.userModal.show();
      },
      error: (err) => {
        console.error('Failed to load user details:', err);
        // Fallback to using the user data from the list
        this.form = {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          password: ''
        };
        this.currentUserImage = user.image || '';
        this.imageFile = null;
        this.imagePreview = null;
        this.userModal.show();
        if (err.status === 401) {
          this.errorMessage = 'USERS.SESSION_EXPIRED';
          setTimeout(() => window.location.href = '/auth/login', 2000);
        } else {
          this.errorMessage = 'USERS.FAILED_TO_LOAD_USER_DETAILS';
        }
      }
    });
  }

  confirmDelete(id: number) {
    this.userToDelete = id;
    this.deleteModal.show();
  }

  deleteConfirmed() {
    if (!this.userToDelete) return;
    this.usersService.delete(this.userToDelete).subscribe({
      next: () => {
        this.successMessage = 'USERS.USER_DELETED_SUCCESS';
        this.loadUsers();
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'USERS.SESSION_EXPIRED';
        } else {
          this.errorMessage = 'USERS.DELETE_FAILED';
        }
      }
    });
    this.deleteModal.hide();
  }

  resetForm() {
    this.form = {
      id: null,
      name: '',
      email: '',
      phone: '',
      password: ''
    };
    this.imageFile = null;
    this.imagePreview = null;
    this.currentUserImage = '';
    this.isEditMode = false;
    this.isUploading = false;
  }

  toggleType(user: any) {
    const updatedType = user.type === 'admin' ? 'user' : 'admin';
    this.usersService.update({
      id: user.id,
      type: updatedType,
    }).subscribe({
      next: () => {
        user.type = updatedType;
        this.successMessage = 'USERS.USER_TYPE_UPDATED_SUCCESS';
        setTimeout(() => this.successMessage = '', 3000);
        this.loadUsers();
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'USERS.SESSION_EXPIRED';
        } else {
          this.errorMessage = 'USERS.ERROR_UPDATING_USER_TYPE';
        }
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  getUserTypeText(type: string): string {
    return type === 'admin' ? 'USERS.ADMIN' : 'USERS.USER';
  }

  getVerificationText(verified: boolean): string {
    return verified ? 'USERS.VERIFIED' : 'USERS.NOT_VERIFIED';
  }
}