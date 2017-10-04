import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../models/User';

@Component({
  selector: 'app-user-profile-select',
  templateUrl: './user-profile-select.component.html',
  styleUrls: ['./user-profile-select.component.css']
})
export class UserProfileSelectComponent {

  // state
  private selectedUserId: string = '';

  // events
  @Input() users: User[];
  @Output() selectRequest: EventEmitter<string> = new EventEmitter();

  onSelectUser(userId: string) {
    this.selectRequest.emit(userId)
  }

  // // deleteUser -- deleted user is being filtered out using the .filter method
  // public deleteUser(user: User) {
  //   this.userServ.deleteUser(user._id).subscribe(response =>
  //     this.users = this.users.filter(users => users !== user),
  //   );
  // }

}
