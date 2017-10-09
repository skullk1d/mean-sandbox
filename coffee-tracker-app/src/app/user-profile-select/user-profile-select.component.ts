import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { User } from '../models/User';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-profile-select',
  templateUrl: './user-profile-select.component.html',
  styleUrls: ['./user-profile-select.component.css']
})
export class UserProfileSelectComponent {
  // displays the full user list and subscribes to changes in the list to redisplay if necessary
  // requests to set the active user

  // state
  private users: User[] = [];

  private subscriptions: Array<[string, Function]> = [
    ['allUsers', this.onGetAllUsers],
    ['addUser', this.onAddUser],
    ['deleteUser', this.onDeleteUser],
    ['updateUser', this.onUpdateUser]
  ]

  @Input() selectedUserId: string = '';
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();

  constructor(private sharedService: SharedService) {
    // when anyone asks for all users, adds or removes a user, users list here will also update and propagate to the template
    /* this.allUsersSubscription = this.sharedService.getSubscription('allUsers').subscribe(users => {
      this.users = users;
    });

    this.addUserSubscription = this.sharedService.getSubscription('addUser').subscribe(res => {
      if (res.success) {
        this.users = this.users.concat(res.newUser);
      }
    }); */

    this.subscriptions.forEach((streamAndHandler: [string, Function]) => {
      this.sharedService.getSubscription(streamAndHandler[0]).subscribe(streamAndHandler[1].bind(this));
    });
  }

  // events
  onSelectUser(userId: string) {
    this.selectRequest.emit(userId)
  }

  // subscriptions
  onGetAllUsers(users) {
    this.users = users;
  }

  onAddUser(res) {
    if (res.success) {
      this.users = this.users.concat(res.newUser);
    }
  }

  onDeleteUser(res) {
    // res includes deleted user's id
    if (res.success) {
      this.users = this.users.filter(user => user._id !== res.userId);
      // reset active user (no longer exists)
      this.onSelectUser('');
    }
  }

  onUpdateUser(res) {
    // TODO: more efficient way than traversing full client data?
    if (res.success) {
      let userToReplace = this.users.find(user => user._id === res.updatedUser._id);

      Object.assign(userToReplace, res.updatedUser);
    }
  }

  // component
  ngOnInit() {
    // can avoid initial call using a BehaviorSubject
    this.loadUsers();
  }

  public loadUsers() {
    // request all users from server and allow subscription to kick in
    this.sharedService.getAllUsers();
  }
}
