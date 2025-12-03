import { Component } from '@angular/core';
import { Social } from './social.model';
import { SocialLinksService } from 'src/app/core/services/social-links.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrl: './social-links.component.scss',
})
export class SocialLinksComponent {
  image = environment.imgUrl + 'socials/';
  totalPages: number = 0;
  currentPage: number = 1;
  socialLinks: Social[] = [];
  newSocialLink: Social = {};
  editSocialLinkData: Social = {};
  selectedFile: File | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private socialLinksService: SocialLinksService) {}

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

  addSocialLink(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an icon to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('icon', this.selectedFile);
    formData.append('name', this.newSocialLink.name || '');
    formData.append('url', this.newSocialLink.url || '');

    this.socialLinksService.store(formData).subscribe(
      () => {
        this.index();
        this.newSocialLink = {};
        this.selectedFile = null;
        this.successMessage = 'Social Link added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add Social Link: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.socialLinksService
      .index(this.currentPage)
      .subscribe((response: any) => {
        this.socialLinks = response.data;
        this.currentPage = response.meta?.current_page || 1;
        this.totalPages = response.meta?.last_page || 1;
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

  deleteSocialLink(id: number | undefined): void {
    if (!id) return;
    this.socialLinksService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Social Link deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete Social Link: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditSocialLinkModal(socialLink: Social): void {
    this.editSocialLinkData = { ...socialLink };
  }

  editSocialLink(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid Social Link ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('icon', this.selectedFile);
    }
    if (this.editSocialLinkData.name) {
      formData.append('name', this.editSocialLinkData.name);
    }
    if (this.editSocialLinkData.url) {
      formData.append('url', this.editSocialLinkData.url);
    }

    this.socialLinksService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editSocialLinkData = {};
        this.selectedFile = null;
        this.successMessage = 'Social Link updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating Social Link: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
