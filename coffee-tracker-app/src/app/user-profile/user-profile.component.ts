import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../services/user.service';
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
  private streams: Array<[string, Function]> = [
    ['getUser', this.onGetUser],
    ['deleteUser', this.onDeleteUser],
    ['updateUser', this.onUpdateUser]
  ];
  private subscriptions: Subscription[] = [];

  // activeUser$: Observable<any>;

  editFirstName: string = '';
  editLastName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.streams.forEach((streamAndHandler: [string, Function]) => {
      this.subscriptions.push(
        this.userService.getSubscription(streamAndHandler[0])
        .subscribe(streamAndHandler[1].bind(this))
      );
    });
  }

  ngOnInit() {
    // if we landed here without active user data, get it ourselves by "subscribing" to url params
    // TODO: explore RxJs BehaviorSubjects to get initial value efficiently
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      return this.userService.getUserById(this.selectedUserId); // must return Observable
    }).subscribe(this.onGetUser.bind(this));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
    this.userService.deleteUser(userId);
  }

  // subscriptions
  onDeleteUser(res) {
    if (res.success) {
      // route to home page
      this.router.navigateByUrl('/');
    } else {
      console.warn(res.message);
    }
  }

  requestUpdateUser(updatedUser) {
    this.userService.updateUser(updatedUser);
  }

  onUpdateUser(res) {
    if (res.success) {
      this.activeUser = res.updatedUser;
      this.editFirstName = this.activeUser.firstName;
      this.editLastName = this.activeUser.lastName;
    } else {
      console.warn(res.message);
    }
  }

  onGetUser(res) {
    if (res.success) {
      // init our model of edited names when we get user
      this.activeUser = res.user;
      this.editFirstName = this.activeUser.firstName;
      this.editLastName = this.activeUser.lastName;

      this.selectedUserId = this.activeUser._id;
    } else {
      console.warn(res.message);
    }
  }
}
