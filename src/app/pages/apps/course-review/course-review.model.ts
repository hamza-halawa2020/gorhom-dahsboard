export interface CourseReview {
  id?: number;
  user_id?: number;
  user?: string;
  course_id?: number;
  course?: string;
  review?: string;
  rating?: number;
  status?: string;
  created_at?: Date | string;
}
