import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostComment } from 'src/app/pages/apps/post-comment/postComment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostCommentService {
  private apiUrl = environment.backEndUrl;
  private data = '/comments';

  constructor(private http: HttpClient) {}

  index(page: number = 1, postId?: number) {
    let url = `${this.apiUrl}/comments-all?page=${page}`;
    if (postId) {
      url += `&post_id=${postId}`;
    }
    return this.http.get(url);
  }
  store(body: PostComment) {
    return this.http.post(`${this.apiUrl}${this.data}`, body);
  }

  update(body: PostComment) {
    return this.http.put(`${this.apiUrl}/comments-update/${body.id}`, body);
  }
  show(id: number) {
    return this.http.get(`${this.apiUrl}${this.data}/${id}`);
  }

  delete(id: number) {
    const url = `${this.apiUrl}${this.data}/${id}`;
    return this.http.delete(url);
  }
}
