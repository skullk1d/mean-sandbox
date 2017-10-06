import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './models/User';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // sets the active user

  // state
  private title = 'Coffee Tracker';
  private selectedUserId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  selectUser(userId) {
    console.log('set active user to', userId);
    this.selectedUserId = userId;

    // if on page displaying user info based on url params (such as profile page), renavigate via new user's id, update route param
    // TODO: get this to work
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) {
        this.router.navigate([this.route.pathFromRoot, userId]);
      }
    });
    /* this.route.params.subscribe(params => {
      if (params.id) {
        this.router.navigate([this.route.pathFromRoot, userId]);
      }
    }); */
  }
}
