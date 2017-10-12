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

  private allUsers$: Observable<User[]>;
  private activeUser$: Observable<User>;

  private activeUserSub: Subscription;
  private deleteUserSub: Subscription;

  private selectedUserId: string = '';
  private editFirstName: string = '';
  private editLastName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.allUsers$ = this.userService.allUsers$;
    this.activeUser$ = this.userService.activeUser$;

    this.activeUserSub = this.activeUser$.subscribe(this.onGetUser.bind(this));
  }

  ngOnInit() {
    // if we landed here without active user data, get it ourselves by "subscribing" to url params
    this.route.paramMap.switchMap((params: ParamMap) => {
      this.selectedUserId = params.get('userId');
      this.userService.getUserById(this.selectedUserId); // must return Observable

      return this.activeUser$;
    }).subscribe(this.onGetUser.bind(this));
  }

  ngOnDestroy() {
    [
      this.activeUserSub,
      this.deleteUserSub
    ].forEach(sub => sub && sub.unsubscribe());
  }

  onSubmit() {
    this.requestUpdateUser({
      _id: this.selectedUserId,
      firstName: this.editFirstName,
      lastName: this.editLastName
    });
  }

  requestDeleteUser(userId: string) {
    this.deleteUserSub = this.userService.deleteUser(userId).subscribe(this.onDeleteUser.bind(this));
  }

  onDeleteUser() {
    this.router.navigateByUrl('/');
  }

  requestUpdateUser(updatedUser: User) {
    this.userService.updateUser(updatedUser);
  }

  onUpdateUser(user: User) {
    this.editFirstName = user.firstName;
    this.editLastName = user.lastName;
  }

  onGetUser(user: User) {
    // init our model of edited names when we get user
    this.editFirstName = user.firstName;
    this.editLastName = user.lastName;
    this.selectedUserId = user._id;
  }
}
