import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';
import { Event } from '../events/event.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent {
  eventDetails: Event | null = null;
  id: any;
  image = environment.imgUrl + 'events/';
  imageFile: File[] = [];
  showAddImageForm = false;
  additionalImages: any;

  selectedImage: File | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.getEventDetails();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }
  getEventDetails(): void {
    this.activateRoute.params.subscribe((params) => {
      this.id = +params['id'];
      this.eventsService.show(this.id).subscribe((data) => {
        this.eventDetails = Object.values(data)[0];
        this.additionalImages = this.eventDetails?.eventImages || [];
      });
    });
  }

  toggleAddImageForm(): void {
    this.showAddImageForm = !this.showAddImageForm;
  }

  onFileSelected(event: any): void {
    this.imageFile = Array.from(event.target.files) as File[];
    for (let file of this.imageFile) {
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'File size exceeds 5 MB';
        setTimeout(() => (this.errorMessage = ''), 3000);

        return;
      }
    }
    // console.log(this.imageFile);
  }

  addImage(id: any): void {
    const formData = new FormData();
    for (let file of this.imageFile) {
      formData.append('image[]', file);
    }
    // console.log(formData);
    this.eventsService.update(id, formData).subscribe(
      (response: any) => {
        this.successMessage = 'Images uploaded successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
        this.getEventDetails();

        this.additionalImages = [
          ...this.additionalImages,
          ...response.data.images,
        ];
        this.showAddImageForm = false;
      },
      (error: any) => {
        // console.error('Failed:', error);
        this.errorMessage =
          'Failed to upload images. Please try again.' +
          this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  deleteImage(imageId: string): void {
    this.eventsService.deleteImage(this.id, imageId).subscribe(
      (response: any) => {
        this.successMessage = 'Image deleted successfully!';
        setTimeout(() => (this.errorMessage = ''), 3000);

        this.additionalImages = this.additionalImages.filter(
          (img: any) => img.id !== imageId
        );
      },
      (error: any) => {
        // console.error('Failed to delete image:', error);
        (this.errorMessage = 'Failed to delete the image. Please try again.'),
          'danger' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
