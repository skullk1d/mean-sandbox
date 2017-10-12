import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-profile-select',
  templateUrl: './user-profile-select.component.html',
  styleUrls: ['./user-profile-select.component.css']
})
export class UserProfileSelectComponent {
  // displays the full user list and subscribes to changes in the list to redisplay if necessary
  // requests to set the active user

  private allUsers$: Observable<User[]>;
  private activeUser$: Observable<User>;

  private activeUserSub: Subscription;

  @Input() selectedUserId: string = '';
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();
  @ViewChild('userSelect') userSelect;

  constructor(private userService: UserService) {
    this.allUsers$ = userService.allUsers$;
    this.activeUser$ = userService.activeUser$;

    this.activeUserSub = this.activeUser$.subscribe(this.onGetUser.bind(this));
  }

  // component
  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    this.activeUserSub.unsubscribe();
  }

  // events
  onSelectUser(userId: string) {
    this.selectRequest.emit(userId);
  }

  // subscriptions
  onGetUser(user: User) {
    // generally if anyone anywhere gets a user, auto select here
    this.selectedUserId = user._id;
    this.onSelectUser(this.selectedUserId); // sync with app

    // update selected display name with forced render (model doesn't update this for some reason)
    // TODO: force change detection? material component bug HACK
    this.userSelect.open();
    this.userSelect.close();
  }

  public loadUsers() {
    // request all users from server and allow subscription to kick in
    this.userService.getAllUsers();
  }
}
