import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/User';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // state
  private title = 'Coffee Tracker';
  private selectedUserId = '';
  private users: User[] = [];

  constructor(private userServ: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  selectUser(userId) {
    console.log('set active user to', userId)
    this.selectedUserId = userId;
  }

  // get all users from server and update the users property
  public loadUsers() {
    this.userServ.getAllUsers().subscribe(response =>
      this.users = response,
    );
  }

  public deleteUser(user: User) {
    this.userServ.deleteUser(user._id).subscribe(response =>
      this.users = this.users.filter(users => users !== user),
    );
  }

  public onAddUser(newUser) {
    this.userServ.addUser(newUser).subscribe(response => {
        this.users = this.users.concat(newUser);
    });

  }
}
