import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Event } from '@angular/router';
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
  private currentUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    // subscribe to route changes to get current path
    this.router.events.subscribe((event: Event) => {
      console.log(event);
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;
      }
    });
  }

  selectUser(userId) {
    if (this.selectedUserId === userId) {
      return;
    }

    console.log('set active user to', userId);

    this.selectedUserId = userId;

    // get new data and announce the active user to everyone
    this.sharedService.getUserById(userId);

    // if on page displaying user info based on url params (such as profile page), renavigate via new user's id
    if (this.route.firstChild.snapshot.params['userId']) {
      // NOTE: cleaner way to parse the path than this?
      const curPath = this.currentUrl.split('/')[1];
      this.router.navigate([`/${curPath}`, userId], { relativeTo: this.route.firstChild });
    }
  }
}
