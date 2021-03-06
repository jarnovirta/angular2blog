import { Injectable }	from '@angular/core';
import { Headers, Http } from '@angular/http';

import { PostService }	from './post.service';
import { Comment }   from './../models/post';

@Injectable()
export class CommentService {
	private headers = new Headers({'Content-Type': 'application/json'});
	private commentsUrl = 'api/comments';  // URL to web api
	
	constructor(private http: Http, private postService: PostService) {}

	private handleError(error: any): Promise<any> {
		console.error('Post service error: ', error); // for demo purposes only
	    return Promise.reject(error.message || error);
	} 
	create(comment: Comment): Promise<Comment> {
		var blogPostId = comment.postId;
		console.dir(comment);
		return this.http
		  .post(this.commentsUrl, JSON.stringify(comment), { headers: this.headers })
		  .toPromise()
		  .then(res => {
		  	var savedComment = new Comment(res.json());
		    this.postService.updateCommentToInMemoryPosts(savedComment);
		    return savedComment;
		  })
		  .catch(this.handleError);
	}
	update(comment: Comment): Promise<Comment> {
	const commentUpdateUrl = this.commentsUrl + '/' + comment._id;
	return this.http
	  .put(commentUpdateUrl, JSON.stringify(comment), { headers: this.headers })
	  .toPromise()
	  .then(() => {
	    this.postService.updateCommentToInMemoryPosts(comment);
	    return comment;
	  })
	  .catch(this.handleError);
	}

	save(comment: Comment): Promise<Comment> {
	if (comment._id) return this.update(comment);
	else return this.create(comment);
	}

	delete(id: string): Promise<void> {
	const url = `${this.commentsUrl}/${id}`;
	return this.http.delete(url, { headers: this.headers })
	  .toPromise()
	  .then(res => {
	  	if (res.status == 200) {
	  		this.postService.deletedCommentFromInMemoryPosts(id);
	  	}
	  	else {
	  		console.log("Server error: " + res.statusText);
	    }
	    return null;
	  })
	  .catch(this.handleError);
	} 
}