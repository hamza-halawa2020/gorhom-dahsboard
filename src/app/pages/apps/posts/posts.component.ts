import { Component } from '@angular/core';
import { PostsService } from 'src/app/core/services/posts.service';
import { Category } from '../categories/category.model';
import { Tag } from '../tags/tag.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Post } from './post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  posts: Post[] = [];
  categories: Category[] = [];
  tags: Tag[] = [];
  addNewPost: Post = {};
  editPostData: Post = {};
  selectedFile: File | null = null;
  image = environment.imgUrl + 'posts/';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private PostsService: PostsService, private router: Router) {}

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
    this.PostsService.getAllCategories().subscribe((response: any) => {
      this.categories = response.data || Object.values(response)[0];
    });
  }

  getAllTags(): void {
    this.PostsService.getAllTags().subscribe((response: any) => {
      this.tags = response.data || Object.values(response)[0];
    });
  }

  addPost(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('category_id', this.addNewPost.category_id || '');
    formData.append('tag_id', this.addNewPost.tag_id || '');
    formData.append('title', this.addNewPost.title || '');
    formData.append('content', this.addNewPost.content || '');

    this.PostsService.store(formData).subscribe(
      () => {
        this.index();
        this.addNewPost = {};
        this.selectedFile = null;
        this.successMessage = 'Post added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add post: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.PostsService.index(this.currentPage).subscribe((response: any) => {
      this.posts = response.data;
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

  deletePost(id: number | undefined): void {
    if (!id) return;
    this.PostsService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Post deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete post: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditPostModal(post: Post): void {
    this.editPostData = { ...post };
  }

  editPost(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid post ID';
      return;
    }

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.editPostData.category_id) {
      formData.append('category_id', this.editPostData.category_id);
    }
    if (this.editPostData.tag_id) {
      formData.append('tag_id', this.editPostData.tag_id);
    }
    if (this.editPostData.title) {
      formData.append('title', this.editPostData.title);
    }
    if (this.editPostData.content) {
      formData.append('content', this.editPostData.content);
    }

    this.PostsService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editPostData = {};
        this.selectedFile = null;
        this.successMessage = 'Post updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating post: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  toggleStatus(post: Post): void {
    const formData = new FormData();
    const updatedStatus = post.status === 'active' ? '1' : 'active';
    formData.append('status', updatedStatus);

    this.PostsService.update(post.id!, formData).subscribe(
      () => {
        post.status = updatedStatus;
        this.successMessage = 'Post status updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating post status: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
