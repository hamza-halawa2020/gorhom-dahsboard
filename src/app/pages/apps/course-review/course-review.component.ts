import { Component } from '@angular/core';
import { CourseReview } from './course-review.model';
import { CourseReviewService } from 'src/app/core/services/course-review.service';
import { Course } from '../courses/course.model';

@Component({
  selector: 'app-course-review',
  templateUrl: './course-review.component.html',
  styleUrl: './course-review.component.scss',
})
export class CourseReviewComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  courses: Course[] = [];
  courseReiviewes: CourseReview[] = [];
  addNewCouseReview: CourseReview = {};
  successMessage: string = '';
  errorMessage: string = '';
  constructor(private CoursesReviewService: CourseReviewService) {}

  ngOnInit(): void {
    this.index();
    this.getAllCategories();
  }
  getAllCategories() {
    this.CoursesReviewService.getAllCourses().subscribe((data) => {
      this.courses = Object.values(data)[0];
      // console.log(this.countries);
    });
  }
  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  addCourseReview() {
    this.CoursesReviewService.store(this.addNewCouseReview).subscribe(
      () => {
        this.index();
        this.addNewCouseReview = {};
        this.successMessage = 'Course added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error: any) => {
        // console.error('Failed to add Course', error);
        this.errorMessage =
          'Failed to add Course. ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.CoursesReviewService.index(this.currentPage).subscribe(
      (response: any) => {
        this.courseReiviewes = response.data;
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

  deleteCourseReview(id: number | undefined): void {
    if (!id) return;
    this.CoursesReviewService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Course deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting Course', error);
        this.errorMessage =
          'Failed to delete Course' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(Course: any): void {
    const updatedStatus = Course.status === 'active' ? 'inactive' : 'active';
    this.CoursesReviewService.update({
      id: Course.id,
      status: updatedStatus,
    }).subscribe(
      () => {
        Course.status = updatedStatus;
        this.successMessage = 'Course status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error updating Course status', error);
        this.errorMessage =
          'Error updating Course status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
