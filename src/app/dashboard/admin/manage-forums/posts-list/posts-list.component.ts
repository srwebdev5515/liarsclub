import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MainService } from '../../../../services/main.service';
import { TopicsService } from '../../../../services/topics.service';
import { PostsService } from '../../../../services/posts.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {
  private currentTopic;
  private posts;
  private createUser;

  private userNames = [];
  private replyText;

  @Output() postDeleted: EventEmitter<string> = new EventEmitter();

  constructor(private mainService: MainService, private topicsService: TopicsService, private postService: PostsService, private storageService: StorageService ) { }

  ngOnInit() {
    this.getPosts();
  }

  private getPosts() {
    this.postService.getAllPosts().subscribe(
      d => {
        this.posts = [];
        if (this.currentTopic) {
          for (let i = 0; i < d.length; i++) {
            if (d[i].topicId === this.currentTopic._id) {
              this.posts.push(d[i]);
            }
          }
        } else {
          this.posts = d;
        }
      },
      e => {
        console.log(e);
      }
    );
  }

  private getCreatedUserProfile(id) {
    this.mainService.getUserProfileById(id).subscribe(
      d => {
        this.createUser = d;
        console.log(this.createUser);
      },
      e => {
        console.log(e);
      }
    );
  }

  public changeTopic(topic) {
    this.currentTopic = topic;
    this.getPosts();
  }

  private addPost() {
    this.postService.addPost({text: this.replyText, topicId: this.currentTopic._id}).subscribe(
      d => {
        this.getPosts();
      },
      e => {
        console.log(e);
      }
    );
  }

  private delete(id, idx) {
    this.postService.deletePost(id).subscribe(
      d => {
        this.getPosts();
        this.postDeleted.emit('a post deleted');
      },
      e => {
        console.log(e);
      }
    );
  }
}
