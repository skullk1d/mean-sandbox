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
  private updateUserSubscription: Subscription;
  private deleteUserSubscription: Subscription;

  activeUser$ : Observable<User>;

  editFirstName: string = '';
  editLastName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.updateUserSubscription = this.sharedService.getSubscription('updateUser').subscribe(this.onUpdateUser.bind(this));
    this.deleteUserSubscription = this.sharedService.getSubscription('deleteUser').subscribe(this.onDeleteUser.bind(this));
  }

  ngOnInit() {
    this.activeUser$ = this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('id');
      return this.sharedService.getUserById(this.selectedUserId);
    });

    this.activeUser$ = this.activeUser$.map(res => res[0]);

    this.activeUser$.subscribe(user => {
      // init our model of edited names when we get user
      this.editFirstName = user.firstName;
      this.editLastName = user.lastName;
    });
  }

  onSubmit() {
    // send updated props with id as query, update active user subscriptions to updates from now on
    this.activeUser$ = this.sharedService.updateUser({
      _id: this.selectedUserId,
      firstName: this.editFirstName,
      lastName: this.editLastName
    }).map(res => res.updatedUser);
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

  onUpdateUser(res) {
    if (res.success) {
      this.editFirstName = res.updatedUser.firstName;
      this.editLastName = res.updatedUser.lastName;

      console.log(this, 'Updated user', res.updatedUser);
    }
  }
}
