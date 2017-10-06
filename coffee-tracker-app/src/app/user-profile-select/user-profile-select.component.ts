import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  private selectedUserId: string = '';
  private users: User[] = [];
  private allUsersSubscription: Subscription;
  private addUserSubscription: Subscription;

  // events
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();

  constructor(private sharedService: SharedService) {
    // when anyone asks for all users, adds or removes a user, users list here will also update and propagate to the template
    this.allUsersSubscription = this.sharedService.getAllUsersSubscription().subscribe(users => {
      this.users = users;
    });

    this.addUserSubscription = this.sharedService.getAddUserSubscription().subscribe(res => {
      if (res.success) {
        this.users = this.users.concat(res.newUser);
      }
    });
  }

  onSelectUser(userId: string) {
    this.selectRequest.emit(userId)
  }

  ngOnInit() {
    // can avoid initial call using a BehaviorSubject
    this.loadUsers();
  }

  selectUser(userId) {
    console.log('set active user to', userId)
    this.selectedUserId = userId;
  }

  public loadUsers() {
    // request all users from server and allow subscription to kick in
    this.sharedService.getAllUsers();
  }

  // public deleteUser(user: User) {
  //   this.userServ.deleteUser(user._id).subscribe(response =>
  //     this.users = this.users.filter(users => users !== user),
  //   );
  // }

  // public onAddUser(newUser) {
  //   this.userServ.addUser(newUser).subscribe(response => {
  //       this.users = this.users.concat(newUser);
  //   });
  // }
}
