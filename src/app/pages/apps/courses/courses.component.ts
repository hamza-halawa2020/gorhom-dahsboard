import { Component } from '@angular/core';
import { CoursesService } from 'src/app/core/services/courses.service';
import { Course } from './course.model';
import { Category } from '../categories/category.model';
import { Tag } from '../tags/tag.model';
import { Instructor } from '../instructors/instructor.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  courses: Course[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  instructors: Instructor[] = [];
  addNewCourse: Course = {};
  editCourseData: Course = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'Courses/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private CoursesService: CoursesService) {}

  ngOnInit(): void {
    this.index();
    this.getAllCategories();
    this.getAllTags();
    this.getAllInstructors();
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
    this.CoursesService.getAllCategories().subscribe((data) => {
      this.categories = Object.values(data)[0];
    });
  }

  getAllTags(): void {
    this.CoursesService.getAllTags().subscribe((data) => {
      this.tags = Object.values(data)[0];
    });
  }

  getAllInstructors(): void {
    this.CoursesService.getAllInstructors().subscribe((data) => {
      this.instructors = Object.values(data)[0];
    });
  }

  addCourse(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('category_id', this.addNewCourse.category_id || '');
    formData.append('tag_id', this.addNewCourse.tag_id || '');
    formData.append('instructor_id', this.addNewCourse.instructor_id || '');
    formData.append('title', this.addNewCourse.title || '');
    formData.append('description', this.addNewCourse.description || '');
    formData.append('video_url', this.addNewCourse.video_url || '');
    formData.append('price', this.addNewCourse.price || '');
    formData.append(
      'certifications',
      this.addNewCourse.certifications ? '1' : '0'
    );

    this.CoursesService.store(formData).subscribe(
      () => {
        this.index();
        this.addNewCourse = {};
        this.selectedFile = null;
        this.successMessage = 'Course added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add course: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.CoursesService.index(this.currentPage).subscribe((response: any) => {
      this.courses = response.data.map((course: Course) => ({
        ...course,
        certifications: course.certifications === true,
      }));
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

  deleteCourse(id: number | undefined): void {
    if (!id) return;
    this.CoursesService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Course deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete course: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditCourseModal(course: Course): void {
    this.editCourseData = { ...course };
  }

  editCourse(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid course ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editCourseData.category_id) {
      formData.append('category_id', this.editCourseData.category_id);
    }
    if (this.editCourseData.tag_id) {
      formData.append('tag_id', this.editCourseData.tag_id);
    }
    if (this.editCourseData.instructor_id) {
      formData.append('instructor_id', this.editCourseData.instructor_id);
    }
    if (this.editCourseData.title) {
      formData.append('title', this.editCourseData.title);
    }
    if (this.editCourseData.description) {
      formData.append('description', this.editCourseData.description);
    }
    if (this.editCourseData.video_url) {
      formData.append('video_url', this.editCourseData.video_url);
    }
    if (this.editCourseData.price) {
      formData.append('price', this.editCourseData.price);
    }
    formData.append(
      'certifications',
      this.editCourseData.certifications ? '1' : '0'
    );

    this.CoursesService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editCourseData = {};
        this.selectedFile = null;
        this.successMessage = 'Course updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating course: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(course: Course): void {
    const formData = new FormData();
    const updatedStatus = !course.certifications;
    formData.append('certifications', updatedStatus ? '1' : '0');

    this.CoursesService.update(course.id!, formData).subscribe(
      () => {
        course.certifications = updatedStatus;
        this.successMessage = 'Course status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating course status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
