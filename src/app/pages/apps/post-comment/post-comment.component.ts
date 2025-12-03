import { Component } from '@angular/core';
import { PostComment } from './postComment.model';
import { PostCommentService } from 'src/app/core/services/post-comment.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrl: './post-comment.component.scss',
})
export class PostCommentComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  PostComments: PostComment[] = [];
  addNewPostComment: PostComment = {};
  successMessage: string = '';
  errorMessage: string = '';
  postId: number | null = null;
  constructor(
    private PostsCommentService: PostCommentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Extract post ID from the route
    this.postId = parseInt(
      this.route.snapshot.paramMap.get('postId') || '0',
      10
    );

    // If postId is invalid, show an error
    if (!this.postId) {
      this.errorMessage = 'Invalid post ID in the URL.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }
    this.index();
  }

  extractErrorMessage(error: any): string {
    let errorMessage = 'An error occurred';
    if (error && error.error && error.error.errors) {
      errorMessage = Object.values(error.error.errors).flat().join(', ');
    }
    return errorMessage;
  }

  addPostComment(): void {
    if (!this.postId) {
      this.errorMessage = 'Post ID is required to add a comment.';
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }

    // Add postId to the new comment
    this.addNewPostComment.post_id = this.postId;

    this.PostsCommentService.store(this.addNewPostComment).subscribe(
      () => {
        this.index();
        this.addNewPostComment = {};
        this.successMessage = 'Post added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error: any) => {
        // console.error('Failed to add Post', error);
        this.errorMessage =
          'Failed to add Post. ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    const postId = this.postId !== null ? this.postId : undefined;

    this.PostsCommentService.index(this.currentPage, postId).subscribe(
      (response: any) => {
        this.PostComments = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
      },
      (error) => {
        // console.error('Error fetching comments:', error);
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

  deletePostComment(id: number | undefined): void {
    if (!id) return;
    this.PostsCommentService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Post deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error deleting Post', error);
        this.errorMessage =
          'Failed to delete Post' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(Post: any): void {
    const updatedStatus = Post.status === 'active' ? 'inactive' : 'active';
    this.PostsCommentService.update({
      id: Post.id,
      status: updatedStatus,
    }).subscribe(
      () => {
        Post.status = updatedStatus;
        this.successMessage = 'Post status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        // console.error('Error updating Post status', error);
        this.errorMessage =
          'Error updating Post status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
