import { Component } from '@angular/core';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from './category.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  categories: Category[] = [];
  newCategory: Category = {};
  editCategoryData: Category = {};
  successMessage: string = '';
  errorMessage: string = '';
  image = environment.imgUrl + 'categories/';
  selectedFile: File | null = null;

  constructor(private categoriesService: CategoriesService) {}

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

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addCategory(): void {
    const formData = new FormData();
    if (this.newCategory.name) {
      formData.append('name', this.newCategory.name);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categoriesService.store(formData).subscribe(
      () => {
        this.index();
        this.newCategory = {};
        this.selectedFile = null;
        this.successMessage = 'Category added successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to add category: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  index(): void {
    this.categoriesService.index().subscribe((data) => {
      this.categories = Object.values(data)[0];
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

  deleteCategory(id: number | undefined): void {
    if (!id) return;
   
    this.categoriesService.delete(id).subscribe(
      () => {
        this.index();
        this.successMessage = 'Category deleted successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Failed to delete category: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  openEditCategoryModal(category: Category): void {
    this.editCategoryData = { ...category };
  }

  editCategory(id: number | undefined): void {
    if (!id) {
      this.errorMessage = 'Invalid category ID';
      return;
    }
    const formData = new FormData();
    if (this.editCategoryData.name) {
      formData.append('name', this.editCategoryData.name);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.categoriesService.update(id, formData).subscribe(
      () => {
        this.index();
        this.editCategoryData = {};
        this.selectedFile = null;
        this.successMessage = 'Category updated successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage =
          'Error updating category: ' + this.extractErrorMessage(error);
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }
}
