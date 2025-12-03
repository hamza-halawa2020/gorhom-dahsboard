import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CourseReview } from 'src/app/pages/apps/course-review/course-review.model';

@Injectable({
  providedIn: 'root',
})
export class CourseReviewService {
  private apiUrl = environment.backEndUrl;
  private data = '/course-reviews';

  constructor(private http: HttpClient) {}

  index(page: number = 1) {
    return this.http.get(`${this.apiUrl}/course-reviews-all?page=${page}`);
  }

  getAllCourses() {
    return this.http.get(`${this.apiUrl}/courses`);
  }

  store(body: CourseReview) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(body: CourseReview) {
    return this.http.put(
      `${this.apiUrl}/course-reviews-update/${body.id}`,
      body
    );
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
