import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  // requests and displays the active user's data, builds a dirty user object and requests to update a user's data
  // requests to delete a user

  // state
  private selectedUserId: string = '';
  private activeUser: User;
  private subscriptions: Array<[string, Function]> = [
    ['getUser', this.onGetUser],
    ['deleteUser', this.onDeleteUser],
    ['updateUser', this.onUpdateUser]
  ]

  // activeUser$: Observable<any>;

  editFirstName: string = '';
  editLastName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.subscriptions.forEach((streamAndHandler: [string, Function]) => {
      this.sharedService.getSubscription(streamAndHandler[0]).subscribe(streamAndHandler[1].bind(this));
    });
  }

  ngOnInit() {
    // if we landed here without active user data, get it ourselves by "subscribing" to url params
    // TODO: explore RxJs BehaviorSubjects to get initial value efficiently
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      return this.sharedService.getUserById(this.selectedUserId); // must return Observable
    }).subscribe(this.onGetUser.bind(this));
  }

  onSubmit() {
    // send updated props with id as query, update active user subscriptions to updates from now on
    this.requestUpdateUser({
      _id: this.selectedUserId,
      firstName: this.editFirstName,
      lastName: this.editLastName
    });
  }

  requestDeleteUser(userId) {
    this.sharedService.deleteUser(userId);
  }

  // subscriptions
  onDeleteUser(res) {
    if (res.success) {
      console.log('Deleted user', res.userId);
      // route to home page
      this.router.navigate(['/']);
    }
  }

  requestUpdateUser(updatedUser) {
    this.sharedService.updateUser(updatedUser);
  }

  onUpdateUser(res) {
    if (res.success) {
      this.activeUser = res.updatedUser;
      this.editFirstName = this.activeUser.firstName;
      this.editLastName = this.activeUser.lastName;

      console.log(this, 'Updated user', res.updatedUser);
    }
  }

  onGetUser(res) {
    if (res.success) {
      // init our model of edited names when we get user
      this.activeUser = res.user;
      this.editFirstName = this.activeUser.firstName;
      this.editLastName = this.activeUser.lastName;

      this.selectedUserId = this.activeUser._id;
    }
  }
}
