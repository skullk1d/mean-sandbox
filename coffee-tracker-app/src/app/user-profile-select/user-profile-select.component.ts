import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
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
  private activeUser: User;
  private streams: Array<[string, Function]> = [
    ['allUsers', this.onGetAllUsers],
    ['getUser', this.onGetUser],
    ['addUser', this.onAddUser],
    ['deleteUser', this.onDeleteUser],
    ['updateUser', this.onUpdateUser]
  ];
  private subscriptions: Subscription[] = [];

  @Input() selectedUserId: string = '';
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();
  @ViewChild('userSelect') userSelect;

  constructor(private userService: UserService) {
    // when anyone asks for all users, adds or removes a user, users list here will also update and propagate to the template
    this.streams.forEach((streamAndHandler: [string, Function]) => {
      this.subscriptions.push(this.userService.getSubscription(streamAndHandler[0]).subscribe(streamAndHandler[1].bind(this)));
    });
  }

  // component
  ngOnInit() {
    // can avoid initial call using a BehaviorSubject
    this.loadUsers();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // events
  onSelectUser(userId: string) {
    this.selectRequest.emit(userId);
  }

  // subscriptions
  onGetAllUsers(res) {
    if (res.success) {
      this.users = res.users;
    } else {
      console.warn(res.message);
    }
  }

  onAddUser(res) {
    if (res.success) {
      this.users = this.users.concat(res.newUser);
    } else {
      console.warn(res.message);
    }
  }

  onDeleteUser(res) {
    // res includes deleted user's id
    if (res.success) {
      this.users = this.users.filter(user => user._id !== res.userId);
      // reset active user (no longer exists)
      this.onSelectUser('');
    } else {
      console.warn(res.message);
    }
  }

  onUpdateUser(res) {
    // TODO: more efficient way than traversing full client data?
    if (res.success) {
      let userToReplace = this.users.find(user => user._id === res.updatedUser._id);

      Object.assign(userToReplace, res.updatedUser);
      this.activeUser = userToReplace;

      // update selected display name with forced render (model doesn't update this for some reason)
      // TODO: force change detection? material component bug HACK
      this.userSelect.open();
      this.userSelect.close();
    } else {
      console.warn(res.message);
    }
  }

  onGetUser(res) {
    // generally if someone outside of the selecter gets a user, auto select here
    if (res.success) {
      this.activeUser = res.user;
      this.selectedUserId = this.activeUser._id;
      this.onSelectUser(this.selectedUserId); // sync with app
    } else {
      console.warn(res.message);
    }
  }

  public loadUsers() {
    // request all users from server and allow subscription to kick in
    this.userService.getAllUsers();
  }
}
