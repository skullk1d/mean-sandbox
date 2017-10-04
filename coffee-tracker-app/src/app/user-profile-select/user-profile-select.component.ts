import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Component({
  selector: 'app-user-profile-select',
  templateUrl: './user-profile-select.component.html',
  styleUrls: ['./user-profile-select.component.css']
})
export class UserProfileSelectComponent implements OnInit {

  // state
  private users: User[] = [];
  private selectedUserId: string = '';

  // events
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();

  constructor(private userServ: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  onSelectUser(userId: string) {
    this.selectRequest.emit(userId)
  }

  // get all users from server and update the users property
  public loadUsers() {
    this.userServ.getAllUsers().subscribe(response =>
      this.users = response,
    );
  }

  // // deleteUser -- deleted user is being filtered out using the .filter method
  // public deleteUser(user: User) {
  //   this.userServ.deleteUser(user._id).subscribe(response =>
  //     this.users = this.users.filter(users => users !== user),
  //   );
  // }

}
