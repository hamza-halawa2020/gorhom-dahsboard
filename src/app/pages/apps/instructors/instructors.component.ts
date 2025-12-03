import { Component } from '@angular/core';
import { InstructorsService } from 'src/app/core/services/instructors.service';
import { environment } from 'src/environments/environment';
import { Instructor } from './instructor.model';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  instructors: Instructor[] = [];
  addNewInstructor: Instructor = {};
  editInstructorData: Instructor = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'instructors/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private InstructorsService: InstructorsService) {}

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

  addInstructor(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('name', this.addNewInstructor.name || '');
    formData.append('email', this.addNewInstructor.email || '');
    formData.append('phone', this.addNewInstructor.phone || '');
    formData.append('job_title', this.addNewInstructor.job_title || '');
    formData.append('description', this.addNewInstructor.description || '');

    this.InstructorsService.store(formData).subscribe(
      () => {
        this.index();
        this.addNewInstructor = {};
        this.selectedFile = null;
        this.successMessage = 'Instructor added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add instructor: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.InstructorsService.index(this.currentPage).subscribe(
      (response: any) => {
        this.instructors = response.data;
        this.currentPage = response.meta?.current_page || 1;
        this.totalPages = response.meta?.last_page || 1;
      }
    );
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

  deleteInstructor(id: number | undefined): void {
    if (!id) return;
    this.InstructorsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Instructor deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete instructor: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditInstructorModal(instructor: Instructor): void {
    this.editInstructorData = { ...instructor };
  }

  editInstructor(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid instructor ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editInstructorData.name) {
      formData.append('name', this.editInstructorData.name);
    }
    if (this.editInstructorData.email) {
      formData.append('email', this.editInstructorData.email);
    }
    if (this.editInstructorData.phone) {
      formData.append('phone', this.editInstructorData.phone);
    }
    if (this.editInstructorData.job_title) {
      formData.append('job_title', this.editInstructorData.job_title);
    }
    if (this.editInstructorData.description) {
      formData.append('description', this.editInstructorData.description);
    }

    this.InstructorsService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editInstructorData = {};
        this.selectedFile = null;
        this.successMessage = 'Instructor updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating instructor: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
