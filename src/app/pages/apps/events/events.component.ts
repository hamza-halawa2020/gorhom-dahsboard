import { Component } from '@angular/core';
import { EventsService } from 'src/app/core/services/events.service';
import { Category } from '../categories/category.model';
import { Tag } from '../tags/tag.model';
import { environment } from 'src/environments/environment';
import { Event } from './event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  events: Event[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  addNewEvent: Event = {};
  editEventData: Event = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'events/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private EventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.index();
    this.getAllCategories();
    this.getAllTags();
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

  getAllCategories(): void {
    this.EventsService.getAllCategories().subscribe((data) => {
      this.categories = Object.values(data)[0];
    });
  }

  getAllTags(): void {
    this.EventsService.getAllTags().subscribe((data) => {
      this.tags = Object.values(data)[0];
    });
  }

  addEvent(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('category_id', this.addNewEvent.category_id || '');
    formData.append('tag_id', this.addNewEvent.tag_id || '');
    formData.append('title', this.addNewEvent.title || '');
    formData.append('content', this.addNewEvent.content || '');

    this.EventsService.store(formData).subscribe(
      () => {
        this.index();
        this.addNewEvent = {};
        this.selectedFile = null;
        this.successMessage = 'Event added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add event: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.EventsService.index(this.currentPage).subscribe((response: any) => {
      this.events = response.data;
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

  deleteEvent(id: number | undefined): void {
    if (!id) return;
    this.EventsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Event deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete event: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditEventModal(event: Event): void {
    this.editEventData = { ...event };
  }

  editEvent(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid event ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editEventData.category_id) {
      formData.append('category_id', this.editEventData.category_id);
    }
    if (this.editEventData.tag_id) {
      formData.append('tag_id', this.editEventData.tag_id);
    }
    if (this.editEventData.title) {
      formData.append('title', this.editEventData.title);
    }
    if (this.editEventData.content) {
      formData.append('content', this.editEventData.content);
    }

    this.EventsService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editEventData = {};
        this.selectedFile = null;
        this.successMessage = 'Event updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating event: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
