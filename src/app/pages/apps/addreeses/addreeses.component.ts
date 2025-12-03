import { Component } from '@angular/core';
import { Addrees } from './addrees.model';
import { AddreesesService } from 'src/app/core/services/addreeses.service';

@Component({
  selector: 'app-addreeses',
  templateUrl: './addreeses.component.html',
  styleUrl: './addreeses.component.scss',
})
export class AddreesesComponent {
  totalPages: number = 0;
  currentPage: number = 1;
  addreeses: Addrees[] = [];

  constructor(private addreesesService: AddreesesService) {}

  ngOnInit(): void {
    this.index();
  }

  index(): void {
    this.addreesesService
      .adminIndex(this.currentPage)
      .subscribe((response: any) => {
        this.addreeses = response.data;
        this.currentPage = response.meta.current_page;
        this.totalPages = response.meta.last_page;
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
}
