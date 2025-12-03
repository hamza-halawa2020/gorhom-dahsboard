import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainSlider } from './mainSlider.model';
import { MainSlidersService } from 'src/app/core/services/main-sliders.service';

@Component({
  selector: 'app-main-sliders',
  templateUrl: './main-sliders.component.html',
  styleUrl: './main-sliders.component.scss',
})
export class MainSlidersComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  mainSliders: MainSlider[] = [];
  newMainSlider: MainSlider = {};
  editMainSliderData: MainSlider = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'main-sliders/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private mainSlidersService: MainSlidersService) {}

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

  addMainSlider(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('title', this.newMainSlider.title || '');
    formData.append('description', this.newMainSlider.description || '');
    formData.append('link', this.newMainSlider.link || '');
    formData.append('status', 'active');

    this.mainSlidersService.store(formData).subscribe(
      () => {
        this.index();
        this.newMainSlider = {};
        this.selectedFile = null;
        this.successMessage = 'Main Slider added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add Main Slider: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.mainSlidersService
      .adminIndex(this.currentPage)
      .subscribe((response: any) => {
        this.mainSliders = response.data;
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

  deleteMainSlider(id: number | undefined): void {
    if (!id) return;
    this.mainSlidersService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Main Slider deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete Main Slider: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditMainSliderModal(slider: MainSlider): void {
    this.editMainSliderData = { ...slider };
  }

  editMainSlider(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid slider ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editMainSliderData.title) {
      formData.append('title', this.editMainSliderData.title);
    }
    if (this.editMainSliderData.description) {
      formData.append('description', this.editMainSliderData.description);
    }
    if (this.editMainSliderData.link) {
      formData.append('link', this.editMainSliderData.link);
    }

    this.mainSlidersService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editMainSliderData = {};
        this.selectedFile = null;
        this.successMessage = 'Main Slider updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating Main Slider: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(slider: MainSlider): void {
    const formData = new FormData();
    const updatedStatus = slider.status === 'active' ? 'inactive' : 'active';
    formData.append('status', updatedStatus);

    this.mainSlidersService.update(slider.id!, formData).subscribe(
      () => {
        slider.status = updatedStatus;
        this.successMessage = 'Slider status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating slider status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
