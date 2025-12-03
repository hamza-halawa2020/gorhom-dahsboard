import { Component } from '@angular/core';
import { SideBarBanner } from './sideBarBanner.model';
import { AddSidebarBannerService } from 'src/app/core/services/add-sidebar-banner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-sidebar-banners',
  templateUrl: './add-sidebar-banners.component.html',
  styleUrl: './add-sidebar-banners.component.scss',
})
export class AddSidebarBannersComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  sideBarBanners: SideBarBanner[] = [];
  newSideBarBanner: SideBarBanner = {};
  editSideBarBannerData: SideBarBanner = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'side-bar/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private sideBarBannersService: AddSidebarBannerService) {}

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

  addSideBarBanner(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('link', this.newSideBarBanner.link || '');
    formData.append('status', 'active');

    this.sideBarBannersService.store(formData).subscribe(
      () => {
        this.index();
        this.newSideBarBanner = {};
        this.selectedFile = null;
        this.successMessage = 'Sidebar Banner added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add Sidebar Banner: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.sideBarBannersService
      .adminIndex(this.currentPage)
      .subscribe((response: any) => {
        this.sideBarBanners = response.data;
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

  deleteSideBarBanner(id: number | undefined): void {
    if (!id) return;
    this.sideBarBannersService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Sidebar Banner deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete Sidebar Banner: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditSideBarBannerModal(banner: SideBarBanner): void {
    this.editSideBarBannerData = { ...banner };
  }

  editSideBarBanner(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid banner ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editSideBarBannerData.link) {
      formData.append('link', this.editSideBarBannerData.link);
    }

    this.sideBarBannersService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editSideBarBannerData = {};
        this.selectedFile = null;
        this.successMessage = 'Sidebar Banner updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating Sidebar Banner: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(banner: SideBarBanner): void {
    const formData = new FormData();
    const updatedStatus = banner.status === 'active' ? 'inactive' : 'active';
    formData.append('status', updatedStatus);

    this.sideBarBannersService.update(banner.id!, formData).subscribe(
      () => {
        banner.status = updatedStatus;
        this.successMessage = 'Banner status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating banner status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
