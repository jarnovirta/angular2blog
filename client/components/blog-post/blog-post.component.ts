import { Component, AfterViewInit, Injectable, Output, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params }	from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Post }	from './../../shared/models/post';
import { PostService } from './../../shared/services/post.service';
import { EditPostComponent }	from './../editPost/edit-post.component';
import { PageInfoService }	from './../../shared/services/page-info.service';


@Component({
  moduleId: module.id,
  selector: 'blog-post',
  templateUrl: 'blog-post.component.html'
})

export class BlogPostComponent implements AfterViewInit {
	private post: Post;
	showEditPostDiv = false;
	
	@ViewChild(EditPostComponent)
	private editPostComponent: EditPostComponent;

	constructor(private router: Router, 
		private route: ActivatedRoute,
		private postService: PostService,
		private pageInfoService: PageInfoService) {};

	ngAfterViewInit() {

		this.postService.getPost(this.route.snapshot.params['id']).then(post => {
			this.post = post;
			this.postService.setCurrentPost(this.post);
			this.editPostComponent.init(this.post);
		});
	}

	editPost() {
		this.showEditPostDiv = true;
		this.editPostComponent.init(this.post);

	}
	deletePost() {
		this.postService.delete(this.post._id).then(() => {
			this.router.navigate(['/']);
		});
	}
	postEdited(resultPost: Post) {
	    this.showEditPostDiv = false;
	    if (resultPost) {
	      	this.post = resultPost;
	      	this.pageInfoService.refreshPageInfo();	      	
	    }
	  }
}