import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { User } from './models/User';
import { SharedService } from './services/shared.service';

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
    private router: Router,
    private sharedService: SharedService
  ) { }

  selectUser(userId) {
    console.log('set active user to', userId);
    this.selectedUserId = userId;

    // announce the active user to everyone
    this.sharedService.getUserById(userId);

    // if on page displaying user info based on url params (such as profile page), renavigate via new user's id, update route param
    if (this.route.firstChild.snapshot.params['userId']) {
      this.router.navigate(['/profile', userId], { relativeTo: this.route.firstChild });
    }
  }
}
